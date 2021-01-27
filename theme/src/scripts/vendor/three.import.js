import * as THREE from 'three'
import { OrbitControls } from './THREE/controls/OrbitControls'
import { GLTFLoader } from './THREE/loaders/GLTFLoader'
import { DRACOLoader } from './THREE/loaders/DRACOLoader'
import { EffectComposer } from './THREE/postprocessing/EffectComposer'
import { RenderPass } from './THREE/postprocessing/RenderPass'
import { ShaderPass } from './THREE/postprocessing/ShaderPass'
import { OutlinePass } from './THREE/postprocessing/OutlinePass'
import { FXAAShader } from './THREE/shaders/FXAAShader'

Object.assign(THREE, {
  OrbitControls,
  GLTFLoader,
  DRACOLoader,
  EffectComposer,
  RenderPass,
  ShaderPass,
  OutlinePass,
  FXAAShader
})

export default THREE
