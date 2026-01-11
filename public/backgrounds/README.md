# Background Video Setup

## How to Use

1. **Add your video file** to this folder (`public/backgrounds/`)
2. **Name it `bg.mp4`** (or `bg.webm` for better compression)
3. **Refresh the page** - video will appear automatically!

## Recommended Video Specs

- **Format**: MP4 (H.264) or WebM (VP9)
- **Resolution**: 1920x1080 is ideal (will auto-scale)
- **Duration**: 10-30 seconds (loops infinitely)
- **File Size**: Keep under 10MB for fast loading
- **Content**: Abstract, subtle animations work best

## Tips for Best Results

- Use videos with dark tones for dark mode
- Avoid fast movements that distract from content
- Consider using a blur effect in the video itself
- Abstract patterns, particles, gradients work great

## Customization (in layout.tsx)

```tsx
<BackgroundVideo 
  src="/backgrounds/bg.mp4"  // Video path
  opacity={0.15}              // Video opacity (0-1, lower = more subtle)
  overlay={true}              // Dark overlay for readability
  overlayOpacity={0.7}        // Overlay darkness (0-1, higher = darker)
/>
```

## Free Video Resources

- https://www.pexels.com/videos/ (search "abstract background")
- https://pixabay.com/videos/
- https://mixkit.co/free-stock-video/

## Supported Formats

- `.mp4` (recommended)
- `.webm` (smaller file size, good browser support)
