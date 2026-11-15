export const image = (prompt, size = "landscape_4_3") =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt
  )}&image_size=${size}`;

export const heroImage = image(
  "cinematic photograph of an elderly Cantonese grandmother sitting by a wooden window in an old Cantonese shophouse, warm afternoon light, holding a small teacup, nostalgic, film grain, shallow depth of field, muted warm tones, editorial photography",
  "landscape_16_9"
);

export const whyImage = image(
  "close-up of an old cassette recorder and a handwritten family recipe book on a wooden table, a cup of tea, warm window light, nostalgic, film grain, editorial photography",
  "landscape_4_3"
);
