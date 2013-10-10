WEBPACK_BIN = node ./node_modules/webpack/bin/webpack.js
ENTRY = entry.js
OUTPUT = bundle.js

build:
	@$(WEBPACK_BIN) $(ENTRY) $(OUTPUT)

build-min:
	@$(WEBPACK_BIN) $(ENTRY) $(OUTPUT) --optimize-minimize

watch:
	@$(WEBPACK_BIN) $(ENTRY) $(OUTPUT) --watch

.PHONY: build build-min
