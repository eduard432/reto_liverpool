import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    });

    const data = await request.text();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: 'Asistente que etiqueta imagenes con 8 etiquetas en español, la más importante primero, utiliza sinónimos. Sé descriptivo. Responde por ejemplo: "anime, camiseta, negro, hombres"',
            },
          ],
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Etiqueta la siguiente imagen" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${data}`,
              },
            },
          ],
        },
      ],
    });

    if (response.choices[0].message.content) {
      return new Response(
        JSON.stringify({ query: response.choices[0].message.content }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      throw new Error();
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  }
}
