import React, { useEffect, useRef } from "react";
import clamp from "../../assets/helpers/clamp";
import sleep from "../../assets/helpers/sleep";

type Props = { algorithm: string };
export default function Sort({ algorithm }: Props) {
  const canvasRef = useRef(null);

  // ------------------ State ------------------
  const [arraySize, setArraySize] = React.useState(767);

  const CANVAS_WIDTH = Math.floor(window.innerWidth * 0.8);
  const CANVAS_HEIGHT = 500;

  const generateRandomArray = (size: number) => {
    const array = [];
    for (let i = 0; i < size; i++) {
      array.push(clamp(Math.floor(Math.random() * CANVAS_HEIGHT), 5, CANVAS_HEIGHT));
    }
    return array;
  };

  const generateRandomColorArray = (size: number) => {
    const array = [];

    for (let i = 0; i < size; i++) {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);

      let val = "000000000";

      // set val in the format of rrr,ggg,bbb, with leading zeros if necessary to make it 3 digits long each time (e.g. 000,255,000) without commas
      val = r.toString().padStart(3, "0") + g.toString().padStart(3, "0") + b.toString().padStart(3, "0");
      array.push(val);
    }
    return array;
  };

  const [numberArray, setArrayToSort] = React.useState(generateRandomArray(arraySize));
  const [colorArray, setColorArray] = React.useState(generateRandomColorArray(arraySize));

  // Temp
  const [style, setStyle] = React.useState("number");

  const [ms, setMs] = React.useState(1);
  const [ctx, setCtx] = React.useState<any>();
  const [isSorting, setIsSorting] = React.useState(false);

  // Step value skips frames to speed up sorting (e.g. stepValue = 2 skips every other frame), set to 0 to skip all frames
  // (higher step value useful for slower algorithms like bubble sort) (stepValue = 0 is not instant, it's just as fast as the browser can render)
  const [stepValue, setStepValue] = React.useState(1);
  const stepValueRef = useRef(stepValue);
  stepValueRef.current = stepValue;

  const isSortingRef = useRef(isSorting);
  isSortingRef.current = isSorting;

  let arr = numberArray;

  // ------------------ Canvas Functions ------------------
  const WIDTH_OF_BAR = CANVAS_WIDTH / arraySize;
  const CANVAS_BG = "#000000";
  const CANVAS_FG = "#FFFFFF";

  const draw = async () => {
    if (!ctx) return;

    // Draw bg
    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw the array
    if (style === "number") {
      ctx.fillStyle = CANVAS_FG;
      for (let i = 0; i < arr.length; i++) {
        ctx.fillRect(i * WIDTH_OF_BAR, CANVAS_HEIGHT, WIDTH_OF_BAR, -arr[i]);

        ctx.strokeStyle = "white";
        ctx.strokeRect(i * WIDTH_OF_BAR, CANVAS_HEIGHT, WIDTH_OF_BAR, -arr[i]);
      }
    } else if (style === "color") {
      for (let i = 0; i < arr.length; i++) {
        // let r = Math.floor(parseInt(arr[i]) / 1000000);
        // let g = Math.floor((parseInt(arr[i]) % 1000000) / 1000);
        // let b = Math.floor(parseInt(arr[i]) % 1000);
        // ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        // ctx.fillRect(i * WIDTH_OF_BAR, CANVAS_HEIGHT, WIDTH_OF_BAR, -CANVAS_HEIGHT);
        // ctx.strokeStyle = "white";
        // ctx.strokeRect(i * WIDTH_OF_BAR, CANVAS_HEIGHT, WIDTH_OF_BAR, -CANVAS_HEIGHT);
      }
    }
  };

  // Initialize Canvas
  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    setCtx(context);
  }, []);

  // Initial Draw
  useEffect(() => {
    draw();
  }, [ctx, numberArray]);

  const runSort = async () => {
    if (isSorting) return;
    setIsSorting(true);

    if (algorithm === "bubble-sort") await bubbleSort();
    if (algorithm === "selection-sort") await selectionSort();
    if (algorithm === "insertion-sort") await insertionSort();
    if (algorithm === "quick-sort") await quickSort();
    if (algorithm === "jannin-sort") await janninSort();

    setIsSorting(false);
    draw();
  };

  // ------------------ Helper Functions ------------------
  let counter = 0;

  async function update() {
    if (!isSortingRef.current) return;

    counter++;
    if (counter % stepValueRef.current !== 0) {
      return;
    }

    await sleep(ms);
    draw();
  }

  const reset = () => {
    setIsSorting(false);
    setArrayToSort(generateRandomArray(arraySize));
  };

  // ------------------ Sorting Algorithms ------------------
  const bubbleSort = async () => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];

          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }

        await update();
      }
    }
  };

  // ------------------ Selection Sort ------------------
  const selectionSort = async () => {
    for (let i = 0; i < arr.length; i++) {
      let min = i;

      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[min]) min = j;
      }

      if (min !== i) {
        let temp = arr[i];
        arr[i] = arr[min];
        arr[min] = temp;
      }

      await update();
    }
  };

  // ------------------ Insertion Sort ------------------
  const insertionSort = async () => {
    for (let i = 1; i < arr.length; i++) {
      let j = i - 1;
      let temp = arr[i];

      while (j >= 0 && arr[j] > temp) {
        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = temp;
      await update();
    }
  };

  // ------------------ Quick Sort ------------------
  const quickSort = async () => {
    const partition = async (low: number, high: number) => {
      let pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          let temp = arr[i];

          arr[i] = arr[j];
          arr[j] = temp;
        }

        await update();
      }

      let temp = arr[i + 1];

      arr[i + 1] = arr[high];
      arr[high] = temp;

      return i + 1;
    };

    const quickSortHelper: any = async (low: number, high: number) => {
      if (low < high) {
        let pi = await partition(low, high);

        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      }
    };

    await quickSortHelper(0, arr.length - 1);
    await update();
  };

  // ------------------ Jannin Sort ------------------
  const janninSort = async () => {
    alert("Jannin Sort is not implemented yet");
  };

  // ------------------ Render ------------------
  return (
    <div>
      {/* Slider for speed */}
      <div className="slider-container">
        <div className="slider-label">Speed</div>
        <input
          type="range"
          min="1"
          max="100"
          value={stepValue}
          onChange={(e) => setStepValue(parseInt(e.target.value))}
        />
      </div>
      <button onClick={runSort}>Sort!</button>
      <button onClick={reset}>Reset</button>
      <br />
      <canvas style={{ border: "1px solid black" }} ref={canvasRef} width={500} height={500} />
    </div>
  );
}
