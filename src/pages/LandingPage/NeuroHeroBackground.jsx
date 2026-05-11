import { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
precision mediump float;

varying vec2 vUv;
attribute vec2 a_position;

void main() {
  vUv = 0.5 * (a_position + 1.0);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying vec2 vUv;
uniform float u_time;
uniform float u_ratio;
uniform vec2 u_pointer_position;
uniform float u_scroll_progress;

vec2 rotate2d(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float neuro_shape(vec2 uv, float t, float p) {
  vec2 sine_acc = vec2(0.0);
  vec2 res = vec2(0.0);
  float scale = 8.0;

  for (int j = 0; j < 15; j++) {
    uv = rotate2d(uv, 1.0);
    sine_acc = rotate2d(sine_acc, 1.0);
    vec2 layer = uv * scale + float(j) + sine_acc - t;
    sine_acc += sin(layer) + 2.4 * p;
    res += (0.5 + 0.5 * cos(layer)) / scale;
    scale *= 1.2;
  }

  return res.x + res.y;
}

void main() {
  vec2 uv = 0.5 * vUv;
  uv.x *= u_ratio;

  vec2 pointer = vUv - u_pointer_position;
  pointer.x *= u_ratio;
  float p = clamp(length(pointer), 0.0, 1.0);
  p = 0.5 * pow(1.0 - p, 2.0);

  float t = 0.001 * u_time;
  float noise = neuro_shape(uv, t, p);

  noise = 1.35 * pow(noise, 3.0);
  noise += pow(noise, 10.0);
  noise = max(0.0, noise - 0.44);
  noise *= (1.0 - length(vUv - 0.5));

  vec3 base = vec3(
    1.0,
    0.18 + 0.04 * cos(3.0 * u_scroll_progress),
    0.24 + 0.05 * sin(3.0 * u_scroll_progress)
  );

  vec3 color = base * noise * 1.08;
  gl_FragColor = vec4(color, noise * 0.68);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);

    gl.deleteShader(shader);
    throw new Error(error || 'Shader compile failed');
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);

    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(error || 'Program link failed');
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

export default function NeuroHeroBackground({ randomStart = false, timeOffset = 0 }) {
  const canvasRef = useRef(null);
  const timeOffsetRef = useRef(randomStart ? Math.random() * 100000 : timeOffset);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });

    if (!gl) return undefined;

    let raf = 0;
    let destroyed = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderTimeOffset = timeOffsetRef.current;

    const pointer = {
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5,
    };

    let program;

    try {
      program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    } catch (error) {
      console.error(error);
      return undefined;
    }

    const uniforms = {
      time: gl.getUniformLocation(program, 'u_time'),
      ratio: gl.getUniformLocation(program, 'u_ratio'),
      pointer: gl.getUniformLocation(program, 'u_pointer_position'),
      scroll: gl.getUniformLocation(program, 'u_scroll_progress'),
    };

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uniforms.ratio, canvas.width / Math.max(canvas.height, 1));
    };

    const updatePointer = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();

      pointer.tx = (clientX - rect.left) / Math.max(rect.width, 1);
      pointer.ty = 1 - (clientY - rect.top) / Math.max(rect.height, 1);
    };

    const handlePointerMove = event => updatePointer(event.clientX, event.clientY);

    const handleTouchMove = event => {
      const touch = event.targetTouches[0];

      if (touch) {
        updatePointer(touch.clientX, touch.clientY);
      }
    };

    const render = now => {
      if (destroyed) return;

      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uniforms.time, now + renderTimeOffset);
      gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
      gl.uniform1f(uniforms.scroll, window.scrollY / (2 * Math.max(window.innerHeight, 1)));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = window.requestAnimationFrame(render);
    };

    resize();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    raf = window.requestAnimationFrame(render);

    return () => {
      destroyed = true;

      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);

      if (vertexBuffer) {
        gl.deleteBuffer(vertexBuffer);
      }

      if (program) {
        gl.deleteProgram(program);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full opacity-100" />
    </div>
  );
}