#!/usr/bin/env bash
set -euo pipefail

MODEL="Xenova/multilingual-e5-small"
DIR="public/models/$MODEL"

mkdir -p "$DIR/onnx"

echo "Downloading $MODEL files..."

curl -sL -o "$DIR/config.json" \
  "https://huggingface.co/$MODEL/resolve/main/config.json" &
curl -sL -o "$DIR/tokenizer.json" \
  "https://huggingface.co/$MODEL/resolve/main/tokenizer.json" &
curl -sL -o "$DIR/tokenizer_config.json" \
  "https://huggingface.co/$MODEL/resolve/main/tokenizer_config.json" &
curl -sL -o "$DIR/special_tokens_map.json" \
  "https://huggingface.co/$MODEL/resolve/main/special_tokens_map.json" &
curl -sL -o "$DIR/quant_config.json" \
  "https://huggingface.co/$MODEL/resolve/main/quant_config.json" &
curl -sL -o "$DIR/sentencepiece.bpe.model" \
  "https://huggingface.co/$MODEL/resolve/main/sentencepiece.bpe.model" &
wait

echo "Downloading ONNX model (~112MB, may take a while)..."
curl -L -o "$DIR/onnx/model_quantized.onnx" \
  "https://huggingface.co/$MODEL/resolve/main/onnx/model_quantized.onnx"

echo "Done! Files in $DIR"
ls -lh "$DIR" "$DIR/onnx"
