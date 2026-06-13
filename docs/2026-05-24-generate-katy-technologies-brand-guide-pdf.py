# pyright: reportMissingImports=false, reportMissingModuleSource=false
from __future__ import annotations

# Build note:
#   python3 -m pip install --target /tmp/kt-reportlab reportlab
#   PYTHONPATH=/tmp/kt-reportlab python3 docs/2026-05-24-generate-katy-technologies-brand-guide-pdf.py

import math
import random
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
LOGOS = ROOT / "assets" / "logos" / "brand-guide"
OUT = DOCS / "2026-05-24-katy-technologies-brand-guide.pdf"
ASSETS = DOCS / "2026-05-24-brand-guide-assets"
ASSETS.mkdir(exist_ok=True)

PAGE_W, PAGE_H = letter
MARGIN = 44

NAVY = "#071A33"
DARK_NAVY = "#06192D"
MID_NAVY = "#0A213A"
DEEP_SLATE = "#263D54"
SOFT_SLATE = "#536B80"
BLUE_GRAY = "#7F95AA"
WARM_TAUPE = "#8B8080"
WARM_TAUPE_SHADE = "#6F6666"
WARM_TAUPE_TINT = "#AFA7A7"
WARM_TAUPE_PALE = "#D1CCCC"
PAPER = "#F8F7F2"
WHITE = "#FFFFFF"


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def blend(a: str, b: str, t: float) -> tuple[int, int, int]:
    ar, ag, ab = hex_to_rgb(a)
    br, bg, bb = hex_to_rgb(b)
    return (
        round(ar + (br - ar) * t),
        round(ag + (bg - ag) * t),
        round(ab + (bb - ab) * t),
    )


def set_fill(c: canvas.Canvas, color: str, alpha: float = 1) -> None:
    c.setFillColorRGB(*(v / 255 for v in hex_to_rgb(color)), alpha=alpha)


def set_stroke(c: canvas.Canvas, color: str, alpha: float = 1) -> None:
    c.setStrokeColorRGB(*(v / 255 for v in hex_to_rgb(color)), alpha=alpha)


def register_fonts() -> tuple[str, str, str]:
    font_dir = ROOT / "assets" / "fonts" / "brand-guide"
    fonts = {
        "KTWorkSans": font_dir / "WorkSans-Medium.ttf",
        "KTWorkSansBold": font_dir / "WorkSans-Bold.ttf",
        "KTLiterata": font_dir / "Literata-Regular.ttf",
    }

    missing = [str(path) for path in fonts.values() if not path.exists()]
    if missing:
        raise FileNotFoundError(
            "Missing brand font files. Download Work Sans and Literata before building: "
            + ", ".join(missing)
        )

    for font_name, font_path in fonts.items():
        pdfmetrics.registerFont(TTFont(font_name, str(font_path)))

    return "KTWorkSans", "KTLiterata", "KTWorkSansBold"


FONT_SANS, FONT_SERIF, FONT_BOLD = register_fonts()


def create_cover_art() -> Path:
    w, h = 1800, 2400
    img = Image.new("RGB", (w, h), hex_to_rgb(DARK_NAVY))
    px = img.load()
    random.seed(24)

    for y in range(h):
        base_t = y / h
        for x in range(w):
            diag = (x / w * 0.58) + (base_t * 0.42)
            wave = math.sin((x / w * 1.2 + y / h * 0.9) * math.pi)
            t = max(0, min(1, diag + wave * 0.08))
            if t < 0.45:
                color = blend(DARK_NAVY, MID_NAVY, t / 0.45)
            elif t < 0.78:
                color = blend(MID_NAVY, DEEP_SLATE, (t - 0.45) / 0.33)
            else:
                color = blend(DEEP_SLATE, SOFT_SLATE, (t - 0.78) / 0.22)
            grain = random.randint(-10, 10)
            px[x, y] = tuple(max(0, min(255, v + grain)) for v in color)

    draw = ImageDraw.Draw(img, "RGBA")
    for x in range(0, w, 64):
        draw.line((x, 0, x, h), fill=(255, 255, 255, 14), width=2)
    for y in range(0, h, 64):
        draw.line((0, y, w, y), fill=(255, 255, 255, 12), width=2)

    out = ASSETS / "2026-05-24-cover-blueprint-grain.png"
    img.save(out)
    return out


def create_watermark_asset(source_name: str, output_name: str, opacity: float) -> Path:
    source = LOGOS / source_name
    output = ASSETS / output_name
    if output.exists():
        return output

    img = Image.open(source).convert("RGBA")
    alpha = img.getchannel("A")
    alpha = alpha.point(lambda value: round(value * opacity))
    img.putalpha(alpha)
    img.save(output)
    return output


def draw_text(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    size: float = 10,
    leading: float | None = None,
    font: str | None = None,
    color: str = NAVY,
    alpha: float = 1,
) -> float:
    font = font or FONT_SERIF
    leading = leading or size * 1.35
    c.setFont(font, size)
    set_fill(c, color, alpha)
    lines: list[str] = []
    for para in text.split("\n"):
        if not para.strip():
            lines.append("")
        else:
            current = ""
            for word in para.split():
                candidate = f"{current} {word}".strip()
                if pdfmetrics.stringWidth(candidate, font, size) <= width:
                    current = candidate
                else:
                    if current:
                        lines.append(current)
                    current = word
            if current:
                lines.append(current)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_label(c: canvas.Canvas, text: str, x: float, y: float, color: str = BLUE_GRAY) -> None:
    c.setFont(FONT_BOLD, 7.5)
    set_fill(c, color, 0.9)
    c.drawString(x, y, text.upper())


def draw_hairline(c: canvas.Canvas, x1: float, y: float, x2: float, color: str = NAVY, alpha: float = 0.14) -> None:
    set_stroke(c, color, alpha)
    c.setLineWidth(0.45)
    c.line(x1, y, x2, y)


def draw_page_header(c: canvas.Canvas, title: str, section: str) -> None:
    set_fill(c, PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    for x in range(0, int(PAGE_W), 28):
        set_stroke(c, NAVY, 0.045)
        c.line(x, 0, x, PAGE_H)
    for y in range(0, int(PAGE_H), 28):
        set_stroke(c, NAVY, 0.04)
        c.line(0, y, PAGE_W, y)
    draw_label(c, section, MARGIN, PAGE_H - 44, NAVY)
    c.setFont(FONT_BOLD, 25)
    set_fill(c, NAVY)
    c.drawString(MARGIN, PAGE_H - 76, title)
    draw_hairline(c, MARGIN, PAGE_H - 94, PAGE_W - MARGIN)


def draw_module(c: canvas.Canvas, x: float, y: float, w: float, h: float, title: str, body: str) -> None:
    pad_x = 16
    label_y = y - 20
    body_y = y - 44
    set_fill(c, WHITE, 0.36)
    c.rect(x, y - h, w, h, fill=1, stroke=0)
    set_stroke(c, NAVY, 0.13)
    c.rect(x, y - h, w, h, fill=0, stroke=1)
    draw_label(c, title, x + pad_x, label_y, NAVY)
    draw_text(c, body, x + pad_x, body_y, w - (pad_x * 2), 8.5, 11.2, FONT_SANS, NAVY, 0.82)


def draw_logo(c: canvas.Canvas, path: str, x: float, y: float, w: float, h: float | None = None) -> None:
    h = h or w
    c.drawImage(ImageReader(str(ROOT / path)), x, y, width=w, height=h, mask="auto")


def draw_watermark(c: canvas.Canvas, surface: str = "light") -> None:
    if surface == "dark":
        source = "2026-05-24-kt-logo-dark-surface-white-slate-transparent.png"
        output = "2026-05-24-kt-watermark-dark-surface.png"
        opacity = 0.22
    else:
        source = "2026-05-24-kt-logo-one-ink-navy-knockout-transparent.png"
        output = "2026-05-24-kt-watermark-light-surface.png"
        opacity = 0.16

    watermark = create_watermark_asset(source, output, opacity)
    size = 70
    c.drawImage(
        ImageReader(str(watermark)),
        PAGE_W - MARGIN - size,
        20,
        width=size,
        height=size,
        mask="auto",
    )


def finish_page(c: canvas.Canvas, watermark_surface: str = "light") -> None:
    draw_watermark(c, watermark_surface)
    c.showPage()


def cover(c: canvas.Canvas) -> None:
    cover_img = create_cover_art()
    c.drawImage(ImageReader(str(cover_img)), 0, 0, PAGE_W, PAGE_H)
    draw_logo(
        c,
        "assets/logos/brand-guide/2026-05-24-kt-logo-dark-surface-white-slate-transparent.png",
        PAGE_W - 270,
        PAGE_H - 350,
        210,
    )
    set_fill(c, WHITE)
    c.setFont(FONT_BOLD, 42)
    c.drawString(MARGIN, 154, "Katy Technologies")
    c.drawString(MARGIN, 108, "Brand Guide")
    draw_label(c, "2026-05-24", MARGIN, 74, WHITE)
    c.showPage()


def page_foundation(c: canvas.Canvas) -> None:
    draw_page_header(c, "Brand Foundation", "01")
    y = PAGE_H - 132
    y = draw_text(c, "Efficient yet human. Technically precise yet warm. Automation-forward without AI hype.", MARGIN, y, 440, 15, 20, FONT_SERIF)
    y -= 18
    col_w = (PAGE_W - 2 * MARGIN - 16) / 2
    draw_module(c, MARGIN, y, col_w, 116, "Audience", "Enterprise executives and operational leaders facing manual internal processes and cautious AI adoption.")
    draw_module(c, MARGIN + col_w + 16, y, col_w, 116, "Desired Response", "Reassured. The brand should feel like an experienced advisor helping clarify the bottleneck before suggesting tools.")
    y -= 150
    draw_module(c, MARGIN, y, col_w, 142, "Canonical Offering", "We help enterprise teams automate manual workflows with practical AI and custom software.")
    draw_module(c, MARGIN + col_w + 16, y, col_w, 142, "Primary CTA", "Talk through a bottleneck. CTAs should invite diagnosis and conversation, not aggressive conversion.")
    finish_page(c)


def page_logo(c: canvas.Canvas) -> None:
    draw_page_header(c, "Logo System", "02")
    y = PAGE_H - 128
    draw_text(c, "Use the outlined SVG as the source. The primary mark stays original; supporting variants solve specific background and reproduction needs.", MARGIN, y, 480, 11, 15, FONT_SERIF)
    y -= 96
    items = [
        ("Primary", "assets/logos/brand-guide/2026-05-24-kt-logo-primary-transparent.png", NAVY),
        ("Dark Surface", "assets/logos/brand-guide/2026-05-24-kt-logo-dark-surface-white-slate-transparent.png", DARK_NAVY),
        ("One-Ink Knockout", "assets/logos/brand-guide/2026-05-24-kt-logo-one-ink-navy-knockout-transparent.png", PAPER),
        ("Navy/Slate Tonal", "assets/logos/brand-guide/2026-05-24-kt-logo-navy-slate-tonal-transparent.png", PAPER),
    ]
    box_w, box_h = 246, 136
    for i, (label, img, bg) in enumerate(items):
        x = MARGIN + (i % 2) * (box_w + 28)
        top = y - (i // 2) * 186
        set_fill(c, bg)
        c.rect(x, top - box_h, box_w, box_h, fill=1, stroke=0)
        set_stroke(c, NAVY if bg == PAPER else WHITE, 0.14)
        c.rect(x, top - box_h, box_w, box_h, fill=0, stroke=1)
        draw_logo(c, img, x + 76, top - 112, 94)
        draw_label(c, label, x, top - box_h - 18, NAVY)
    y -= 400
    draw_text(c, "Layering rule: the T must sit above the K/arrow. For background textures or one-ink use where the T must visibly read on top, use the knockout-under-T asset.", MARGIN, y, 500, 10.5, 14.5, FONT_SERIF)
    finish_page(c)


def page_visual_language(c: canvas.Canvas) -> None:
    draw_page_header(c, "Color, Grain, and Grid", "03")
    y = PAGE_H - 130
    colors = [
        (NAVY, "Deep Navy"),
        (DARK_NAVY, "Blueprint Navy"),
        (DEEP_SLATE, "Deep Slate"),
        (SOFT_SLATE, "Soft Slate"),
        (BLUE_GRAY, "Blue-Gray"),
        (WARM_TAUPE, "Warm Taupe"),
        (PAPER, "Warm Paper"),
    ]
    sw = 68
    for i, (color, label) in enumerate(colors):
        x = MARGIN + i * 74
        set_fill(c, color)
        c.rect(x, y - 62, sw, 48, fill=1, stroke=0)
        set_stroke(c, NAVY, 0.16)
        c.rect(x, y - 62, sw, 48, fill=0, stroke=1)
        draw_text(c, label, x, y - 76, sw, 6.7, 8.5, FONT_SANS, NAVY, 0.75)
        draw_text(c, color, x, y - 88, sw, 6.5, 8, FONT_SANS, NAVY, 0.62)
    y -= 140
    draw_module(c, MARGIN, y, 248, 138, "Palette Rule", "Stay within logo colors plus neutrals. Warm Gray / Taupe is the only secondary neutral. Use tints, shades, opacity, line style, labels, and pattern.")
    draw_module(c, MARGIN + 270, y, 248, 138, "Blueprint Fade", "Use directional linear gradients with fine dense grain. Avoid radial glows and generic AI gradients.")
    y -= 178
    draw_module(c, MARGIN, y, 248, 120, "Secondary Neutral", "Use Warm Gray / Taupe (#8B8080) plus #6F6666, #AFA7A7, and #D1CCCC for warmth, secondary notes, and quiet contrast. Do not introduce additional warm accent hues.")
    draw_module(c, MARGIN + 270, y, 248, 120, "Grain Rule", "Fine photo grain only. It should reduce banding and add atmosphere without lowering contrast or muddying colors.")
    finish_page(c)


def page_type_layout(c: canvas.Canvas) -> None:
    draw_page_header(c, "Typography and Layout", "04")
    y = PAGE_H - 132
    c.setFont(FONT_SANS, 31)
    set_fill(c, NAVY)
    c.drawString(MARGIN, y, "Work Sans for every header")
    y -= 42
    c.setFont(FONT_SERIF, 24)
    c.drawString(MARGIN, y, "Literata for body copy and advisory prose.")
    y -= 52
    draw_text(c, "Layouts should feel like sharp adjacent planes, not nested card stacks. Use faint hairlines, spacing, alignment, and tonal shifts to imply structure.", MARGIN, y, 500, 11.5, 16, FONT_SERIF)
    y -= 90
    draw_module(c, MARGIN, y, 160, 142, "Shape", "Sharp and rectilinear. Avoid rounded SaaS cards.")
    draw_module(c, MARGIN + 178, y, 160, 142, "Edges", "Use very faint hairlines. Structure should recede behind content.")
    draw_module(c, MARGIN + 356, y, 160, 142, "Grid", "Rare, purposeful, and strongest only in diagrams or selected openers.")
    finish_page(c)


def page_diagrams(c: canvas.Canvas) -> None:
    draw_page_header(c, "Diagrams and Annotations", "05")
    y = PAGE_H - 124
    draw_text(c, "Base diagrams are precise system diagrams. Handwritten elements are image-based annotations that identify bottlenecks, risks, and decisions.", MARGIN, y, 500, 12, 16, FONT_SERIF)
    y -= 80
    set_stroke(c, NAVY, 0.35)
    c.setLineWidth(1)
    boxes = [(70, y - 52, "Input"), (220, y - 52, "Review"), (390, y - 52, "Decision")]
    for x, by, label in boxes:
        set_fill(c, WHITE, 0.45)
        c.rect(x, by, 104, 48, fill=1, stroke=1)
        draw_label(c, label, x + 14, by + 18, NAVY)
    c.line(174, y - 28, 220, y - 28)
    c.line(324, y - 28, 390, y - 28)
    set_stroke(c, BLUE_GRAY, 0.72)
    c.setLineWidth(1.5)
    p = c.beginPath()
    p.moveTo(140, y - 105)
    p.curveTo(220, y - 142, 340, y - 58, 446, y - 108)
    c.drawPath(p)
    draw_logo(
        c,
        "assets/annotations/2026-05-24-manual-review-handwritten-annotation.png",
        162,
        y - 176,
        320,
        88,
    )
    y -= 210
    draw_module(c, MARGIN, y, 248, 126, "Use", "Process nodes, handoff lines, decision branches, system boundaries, inputs, outputs, risk markers, and annotation callouts.")
    draw_module(c, MARGIN + 270, y, 248, 126, "Avoid", "Stock icons, photography, cartoons, generic doodles, or annotation marks that do not communicate operational meaning.")
    finish_page(c)


def page_components_voice(c: canvas.Canvas) -> None:
    draw_page_header(c, "Components and Voice", "06")
    y = PAGE_H - 132
    draw_module(c, MARGIN, y, 516, 96, "Hero Example", "Automate the work that slows your team down. Practical AI and custom software for workflows that still depend on handoffs, spreadsheets, and manual review.")
    y -= 126
    draw_module(c, MARGIN, y, 248, 124, "Buttons", "Use precise CTAs: Talk through a bottleneck, Map a workflow, Find the slow handoff, Talk with us.")
    draw_module(c, MARGIN + 270, y, 248, 124, "Forms", "Ask what workflow is slowing the team down and what systems are involved. Avoid long sales qualification forms.")
    y -= 164
    draw_module(c, MARGIN, y, 248, 142, "Voice Do", "Warm, advisory, humanistic, plainspoken, and specific. Start with the bottleneck, not the tool. Keep copy at an eighth-grade reading level. Never begin two sentences in a row with the same word.")
    draw_module(c, MARGIN + 270, y, 248, 142, "Voice Don't", "Avoid digital transformation, cutting-edge, innovation, synergy, leverage, seamless, future-proof, and AI-powered everything.")
    finish_page(c)


def page_accessibility(c: canvas.Canvas) -> None:
    draw_page_header(c, "Accessibility and Legibility", "07")
    y = PAGE_H - 130
    draw_text(c, "Atmosphere should never make the work harder to understand.", MARGIN, y, 500, 16, 21, FONT_SERIF)
    y -= 82
    draw_module(c, MARGIN, y, 248, 126, "Text", "Meet WCAG AA: 4.5:1 for normal text and 3:1 for large display text.")
    draw_module(c, MARGIN + 270, y, 248, 126, "Logo", "Use approved supporting assets for light/dark surfaces. Preserve clearspace near active grids or diagrams.")
    y -= 160
    draw_module(c, MARGIN, y, 248, 126, "Grid and Grain", "Grid lines below body copy generally stay below 12% opacity. Grain remains fine, dense, and contrast-safe.")
    draw_module(c, MARGIN + 270, y, 248, 126, "Motion", "Web motion clarifies flow, avoids continuous animation near body copy, and respects reduced-motion preferences.")
    y -= 160
    draw_module(c, MARGIN, y, 516, 110, "Functional Diagrams", "Labels and paths come first. Decorative diagrams may sit behind logos only when they do not cross core logo shapes.")
    finish_page(c)


def page_dos_donts(c: canvas.Canvas) -> None:
    draw_page_header(c, "Do and Don't", "08")
    y = PAGE_H - 132
    draw_module(c, MARGIN, y, 248, 118, "Do", "Use realistic workflow language. Keep grids quiet. Use precise diagrams with purposeful handwritten annotations. Use logo cutout assets for background textures.")
    draw_module(c, MARGIN + 270, y, 248, 118, "Don't", "Use stock photography, generic AI gradients, nested rounded cards, rainbow charts, or vague hype language.")
    y -= 158
    draw_module(c, MARGIN, y, 248, 126, "Do Copy", "Talk through a bottleneck before automating it.")
    draw_module(c, MARGIN + 270, y, 248, 126, "Don't Copy", "Unlock cutting-edge AI transformation with next-generation innovation.")
    finish_page(c)


def page_assets(c: canvas.Canvas) -> None:
    draw_page_header(c, "Asset Appendix", "09")
    y = PAGE_H - 128
    paths = [
        "2026-05-24-kt-logo-primary-transparent",
        "2026-05-24-kt-logo-dark-surface-white-slate-transparent",
        "2026-05-24-kt-logo-one-ink-navy-knockout-transparent",
        "2026-05-24-kt-logo-navy-slate-tonal-transparent",
        "2026-05-24-kt-logo-one-color-white-transparent",
        "2026-05-24-kt-logo-one-color-navy-transparent",
    ]
    for i, name in enumerate(paths):
        row_y = y - i * 78
        bg = NAVY if "white" in name or "dark-surface" in name or "primary" in name else PAPER
        set_fill(c, bg)
        c.rect(MARGIN, row_y - 54, 72, 54, fill=1, stroke=0)
        set_stroke(c, NAVY if bg == PAPER else WHITE, 0.12)
        c.rect(MARGIN, row_y - 54, 72, 54, fill=0, stroke=1)
        draw_logo(c, f"assets/logos/brand-guide/{name}.png", MARGIN + 16, row_y - 48, 42)
        draw_text(c, f"assets/logos/brand-guide/{name}.svg\nassets/logos/brand-guide/{name}.png", MARGIN + 92, row_y - 18, 400, 7.8, 10.5, FONT_SANS, NAVY, 0.8)
    finish_page(c)


def build() -> None:
    c = canvas.Canvas(str(OUT), pagesize=letter)
    c.setTitle("Katy Technologies Brand Guide")
    c.setAuthor("Katy Technologies")
    cover(c)
    page_foundation(c)
    page_logo(c)
    page_visual_language(c)
    page_type_layout(c)
    page_diagrams(c)
    page_components_voice(c)
    page_accessibility(c)
    page_dos_donts(c)
    page_assets(c)
    c.save()


if __name__ == "__main__":
    build()
    print(OUT)
