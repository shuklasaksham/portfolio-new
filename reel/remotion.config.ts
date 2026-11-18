import { Config } from '@remotion/cli/config';

// Sharpest output: lossless PNG frames, then a high-bitrate H.264 encode.
Config.setEntryPoint('./src/index.ts');
Config.setVideoImageFormat('png');
Config.setCodec('h264');
Config.setCrf(12);
Config.setPixelFormat('yuv420p');
Config.setX264Preset('slow');
Config.setConcurrency(4);
