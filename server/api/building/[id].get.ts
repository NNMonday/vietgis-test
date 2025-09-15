import buildings from "~~/shared/data/building";

export default defineEventHandler((e) => {
  const id = e.context.params?.id;
  const result = buildings.find((b) => b.id === Number(id));
  if (result) {
    return result;
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: "Building not found",
    });
  }
});
