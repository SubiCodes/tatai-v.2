import mongoose from 'mongoose';

const embeddedChunkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  author: { type: String }, // ✅ Add this
  guideTitle: { type: String }, // ✅ Add this
});
const EmbeddedChunk = mongoose.model("EmbeddedChunk", embeddedChunkSchema);

export default EmbeddedChunk;
