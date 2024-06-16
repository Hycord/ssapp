import {
  APIEmbedField,
  EmbedBuilder as DiscordJSEmbedBuilder,
  EmbedFooterData,
  RestOrArray,
} from "discord.js";

export class Embed extends DiscordJSEmbedBuilder {
  private footerPretext?: string;
  constructor(pretext?: string) {
    super();
    if (pretext) this.footerPretext = pretext;

    this.setFooterText();
    super.setColor("White");
  }

  public setNamedColor(
    color: "primary" | "secondary" | "success" | "warn" | "error"
  ) {
    switch (color) {
      case "primary":
        super.setColor("#5865F2");
        break;
      case "secondary":
        super.setColor("#EEFF00");
        break;
      case "success":
        super.setColor("#00FF00");
        break;
      case "warn":
        super.setColor("#FF0000");
        break;
      case "error":
        super.setColor("#7C0000");
        break;
    }
    return this;
  }

  private prependFooterPretext(text?: string) {
    return this.footerPretext
      ? `${this.footerPretext} ${(text?.length ?? 0) > 0 ? `~ ${text}` : ""}`
      : `${text}`;
  }

  public override setFooter(data: EmbedFooterData) {
    super.setFooter({
      ...data,
      text: this.prependFooterPretext(data.text),
    });
    return this;
  }

  public disableFooter() {
    super.setFooter(null);
    return this;
  }

  public setFooterText(text?: string) {
    if (text)
      super.setFooter({
        text: this.prependFooterPretext(text),
      });
    else super.setFooter(null);
    return this;
  }

  public override setDescription(description: string | null): this {
    if (description === null) return this;
    if (description.length > 2048) {
      return super.setDescription(`${description.slice(0, 2045)}...`);
    }
    return super.setDescription(description);
  }

  public override addFields(...fields: RestOrArray<APIEmbedField>): this {
    for (const field of fields) {
      if (field instanceof Array) continue;
      if (field.value.length > 1024) {
        field.value = `${field.value.slice(0, 1021)}...`;
      }
    }
    return super.addFields(...fields);
  }
}
