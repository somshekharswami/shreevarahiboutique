import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
//rollup-plugin-visualizer → Generates a visual report of your final JS bundle (tree map view).

export default defineConfig({
  plugins: [
    react(),
    visualizer({  //visualizer({...} => Creates a file bundle-report.html after building.
      filename: 'bundle-report.html',
      open: true, //  Opens the report in your default browser immediately after build.
      gzipSize: true, // Shows size after Gzip compression
      brotliSize: true// Shows size after Brotli compression
    })
  ],
  build: {
    sourcemap: false, // Needed for accurate size analysis
  }
});
