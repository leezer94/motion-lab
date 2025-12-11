"use client";

import template from "./template.json";

type Block = (typeof template)["content"][number]["blocks"][number];
const blocks = template.content[0].blocks as Block[];
const datasetAttr = (path?: string) => (path ? { "data-uxbit-path": path } : {});

type TypographyAnimation =
  | {
      rolling?: boolean;
      typingTexts?: string[];
      typingDuration?: number;
      typingEraseDuration?: number;
      typingLoop?: boolean;
      typingCursor?: boolean;
      typingUnit?: "char" | "word";
    }
  | undefined;

const openLink =
  (href?: string, target = "_blank") =>
  () => {
    if (!href) return;
    window.open(href, target, "noopener,noreferrer");
  };

const typographyAnimationProps = (animation: TypographyAnimation) =>
  animation
    ? {
        rolling: animation.rolling,
        typingTexts: animation.typingTexts ? JSON.stringify(animation.typingTexts) : undefined,
        typingDuration: animation.typingDuration,
        typingEraseDuration: animation.typingEraseDuration,
        typingLoop: animation.typingLoop,
        typingCursor: animation.typingCursor,
        typingUnit: animation.typingUnit,
      }
    : {};

const sectionAttrs = (sectionProps?: Block["sectionProps"]) =>
  sectionProps
    ? {
        padding: sectionProps.padding,
        gap: sectionProps.gap,
        direction: sectionProps.direction,
        center: sectionProps.center,
        "direction-desktop": sectionProps.directionDesktop,
        "wrap-desktop": sectionProps.wrapDesktop,
        "justify-desktop": sectionProps.justifyDesktop,
        "align-desktop": sectionProps.alignDesktop,
        "gap-desktop": sectionProps.gapDesktop,
      }
    : {};

export default function UxbitCanvasPage() {
  return (
    <>
      {blocks.map((block, blockIndex) => (
        <tinto-section
          key={block.WebsiteBlock._id}
          {...datasetAttr(`blocks[${blockIndex}]`)}
          {...sectionAttrs(block.sectionProps)}
          style={
            block.background?.gradient ? { backgroundImage: block.background.gradient } : undefined
          }
        >
          {renderBlock(block, `blocks[${blockIndex}]`)}
        </tinto-section>
      ))}
    </>
  );
}

function renderBlock(block: Block, path: string) {
  switch (block.WebsiteBlock.type) {
    case "cover": {
      const hero = block.hero;
      if (!hero) return null;

      const subtitle = hero.subtitle;
      const cta = block.cta;
      const heroPath = `${path}.hero`;

      return (
        <>
          <tinto-typography
            {...datasetAttr(`${heroPath}.title`)}
            variant={hero.title.variant}
            font={hero.title.font}
            font-size={hero.title.fontSize}
            color={hero.title.color}
            weight={hero.title.weight}
            {...typographyAnimationProps(hero.title.animation as TypographyAnimation)}
          >
            {hero.title.text}
          </tinto-typography>
          {subtitle ? (
            <tinto-typography
              {...datasetAttr(`${heroPath}.subtitle`)}
              variant={subtitle.variant}
              font={subtitle.font}
              font-size={subtitle.fontSize}
              color={subtitle.color}
              weight={subtitle.weight}
              {...typographyAnimationProps(subtitle.animation as TypographyAnimation)}
            >
              {subtitle.text}
            </tinto-typography>
          ) : null}
          {cta ? (
            <tinto-button {...datasetAttr(`${path}.cta`)} onClick={openLink(cta.href, cta.target)}>
              {cta.label}
            </tinto-button>
          ) : null}
        </>
      );
    }
    case "mosaic":
      return (
        <>
          {(block.cards ?? []).map((card, cardIndex) => (
            <tinto-wrapper
              key={card.title}
              {...datasetAttr(`${path}.cards[${cardIndex}]`)}
              direction="column"
              gap="12px"
              padding="20px"
              radius="24px"
              shadow="0 12px 32px rgba(15,23,42,0.25)"
              color="#0f172a"
              style={{ backgroundImage: card.accent }}
            >
              <tinto-typography
                {...datasetAttr(`${path}.cards[${cardIndex}].title`)}
                variant="h3"
                color="#0f172a"
                weight="600"
                {...typographyAnimationProps(card.titleAnimation as TypographyAnimation)}
              >
                {card.title}
              </tinto-typography>
              <tinto-typography
                {...datasetAttr(`${path}.cards[${cardIndex}].body`)}
                variant="p"
                color="#0f172a"
                {...typographyAnimationProps(card.bodyAnimation as TypographyAnimation)}
              >
                {card.body}
              </tinto-typography>
            </tinto-wrapper>
          ))}
          {(block.images ?? []).map((image, imageIndex) => (
            <tinto-image
              key={image.src}
              {...datasetAttr(`${path}.images[${imageIndex}]`)}
              src={image.src}
              ratio={image.ratio}
              rounded={image.rounded}
              background={image.background}
              shadow={image.shadow}
              overlay={image.overlay}
              animation={image.animation}
              width="100%"
            />
          ))}
        </>
      );
    case "gallery":
      return (block.images ?? []).map((image, imageIndex) => (
        <tinto-image
          key={image.src}
          {...datasetAttr(`${path}.images[${imageIndex}]`)}
          src={image.src}
          ratio={image.ratio}
          rounded={image.rounded}
          background={image.background}
          shadow={image.shadow}
          overlay={image.overlay}
          animation={image.animation}
          width="100%"
        />
      ));
    case "quote": {
      const quote = block.quote;
      if (!quote) return null;

      return (
        <tinto-typography
          {...datasetAttr(`${path}.quote`)}
          variant={quote.variant}
          font={quote.font}
          font-size={quote.fontSize}
          color={quote.color}
          highlight={quote.highlight}
          align="center"
          {...typographyAnimationProps(quote.animation as TypographyAnimation)}
        >
          {quote.text} — {quote.author}
        </tinto-typography>
      );
    }
    case "cta": {
      const cta = block.cta;
      if (!cta) return null;

      return (
        <>
          <tinto-typography
            {...datasetAttr(`${path}.cta.title`)}
            variant="h2"
            color="#0f172a"
            weight="700"
            {...typographyAnimationProps(cta.titleAnimation as TypographyAnimation)}
          >
            {cta.title}
          </tinto-typography>
          <tinto-typography
            {...datasetAttr(`${path}.cta.body`)}
            variant="p"
            color="#334155"
            {...typographyAnimationProps(cta.bodyAnimation as TypographyAnimation)}
          >
            {cta.body}
          </tinto-typography>
          <div className="flex flex-wrap gap-3">
            {cta.primary ? (
              <tinto-button
                {...datasetAttr(`${path}.cta.primary`)}
                onClick={openLink(cta.primary.href, cta.primary.target)}
              >
                {cta.primary.label}
              </tinto-button>
            ) : null}
            {cta.secondary ? (
              <tinto-button
                {...datasetAttr(`${path}.cta.secondary`)}
                onClick={openLink(cta.secondary.href, cta.secondary.target)}
              >
                {cta.secondary.label}
              </tinto-button>
            ) : null}
          </div>
        </>
      );
    }
    default:
      return null;
  }
}
