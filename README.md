# Block Physics

Block physics is an addon that adds customizable entities that attempt to mimics by utilizing the mainhand item model and scaling it up to block size. This pack does make use of the experimental GameTest Framework in order to convert blocks into entities, but no other experiment is used and the entities themselves don't use any experimental features.

![image](https://user-images.githubusercontent.com/75375633/178336544-f6ae3279-cdf3-4948-9ffe-3530b3864073.png)

## Installation

To install the pack, download the latest `.mcpack` file under the releases page. Then open the `.mcpack` file and it should import the pack into minecraft. Then apply the pack to your desired world. Make sure to enable BOTH the resource pack AND the behavior pack!

## Building for yourself

To build the pack for yourself, you'll need [Regolith](https://bedrock-oss.github.io/regolith/) and npm (bundled with nodejs, download [here](https://nodejs.org/en/download/)) installed.

1. Clone the repository
2. Open a command prompt in the root directory of the project
3. Run `npm run setup`
4. Run `npm run run-build`
5. A new build of the pack will be located in the `build/` directory
