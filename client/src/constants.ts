export const LINKEDIN_URL = "https://www.linkedin.com/in/ost-tomasz/";

const SPRITE_URL = "/avatars-sprite.svg";

export const avatars = [
  { id: "Av-1", icon: `${SPRITE_URL}#Avatar01` },
  { id: "Av-3", icon: `${SPRITE_URL}#Avatar03` },
  { id: "Av-4", icon: `${SPRITE_URL}#Avatar04` },
  { id: "Av-5", icon: `${SPRITE_URL}#Avatar05` },
  { id: "Av-6", icon: `${SPRITE_URL}#Avatar06` },
  { id: "Av-7", icon: `${SPRITE_URL}#Avatar07` },
  { id: "Av-8", icon: `${SPRITE_URL}#Avatar08` },
  { id: "Av-9", icon: `${SPRITE_URL}#Avatar09` },
  { id: "Av-10", icon: `${SPRITE_URL}#Avatar10` },
  { id: "Av-11", icon: `${SPRITE_URL}#Avatar11` },
  { id: "Av-12", icon: `${SPRITE_URL}#Avatar12` },
  { id: "Av-13", icon: `${SPRITE_URL}#Avatar13` },
  { id: "Av-14", icon: `${SPRITE_URL}#Avatar14` },
  { id: "Av-15", icon: `${SPRITE_URL}#Avatar15` },
  { id: "Av-16", icon: `${SPRITE_URL}#Avatar16` },
  { id: "Av-17", icon: `${SPRITE_URL}#Avatar17` },
  { id: "Av-18", icon: `${SPRITE_URL}#Avatar18` },
  { id: "Av-19", icon: `${SPRITE_URL}#Avatar19` },
  { id: "Av-20", icon: `${SPRITE_URL}#Avatar20` },
  { id: "Av-21", icon: `${SPRITE_URL}#Avatar21` },
] as const;

export type AvatarId = (typeof avatars)[number]["id"];

// avatar: z.enum(avatars.map(a => a.id) as [string, ...string[]])
