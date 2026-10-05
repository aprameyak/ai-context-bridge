#!/bin/bash
# Create simple colored icons

# 16x16
convert -size 16x16 xc:'#667eea' -fill white -gravity center -pointsize 10 -annotate +0+0 'B' icons/icon-16.png

# 48x48
convert -size 48x48 xc:'#667eea' -fill white -gravity center -pointsize 24 -annotate +0+0 'B' icons/icon-48.png

# 128x128
convert -size 128x128 xc:'#667eea' -fill white -gravity center -pointsize 64 -annotate +0+0 'B' icons/icon-128.png
