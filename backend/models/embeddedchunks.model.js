import mongoose from 'mongoose';

const embeddedChunkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
});

const EmbeddedChunk = mongoose.model("EmbeddedChunk", embeddedChunkSchema);

export default EmbeddedChunk;
