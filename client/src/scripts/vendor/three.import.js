import * as THREEE from 'three'
import { OrbitControls } from './THREE/controls/OrbitControls'
import { GLTFLoader } from './THREE/loaders/GLTFLoader'
import { DRACOLoader } from './THREE/loaders/DRACOLoader'
import { EffectComposer } from './THREE/postprocessing/EffectComposer'
import { RenderPass } from './THREE/postprocessing/RenderPass'
import { ShaderPass } from './THREE/postprocessing/ShaderPass'
import { OutlinePass } from './THREE/postprocessing/OutlinePass'
import { FXAAShader } from './THREE/shaders/FXAAShader'

const THREE_PLUGINS = {
  OrbitControls,
  GLTFLoader,
  DRACOLoader,
  EffectComposer,
  RenderPass,
  ShaderPass,
  OutlinePass,
  FXAAShader
}
const THREE = Object.assign({}, THREEE)
Object.entries(THREE_PLUGINS).forEach(([key, plugin]) => THREE[key] = plugin)

export default THREE
