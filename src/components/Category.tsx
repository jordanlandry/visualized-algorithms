import { useState } from "react";
import { CategoryProps } from "../assets/data/interfaces";
import Sort from "./algorithms/Sort";

export default function Category({ id, name, description }: CategoryProps) {
  // This is all temp until I add search algorithms, this is just to test the sorting algorithms
  const [sortingAlgorithm, setSortingAlgorithm] = useState("bubble-sort");

  return (
    <div>
      <div>
        {name} {description}
      </div>
      <div>
        {/* Temp */}
        <select onChange={(e) => setSortingAlgorithm(e.target.value)} value={sortingAlgorithm}>
          <option value="bubble-sort">Bubble Sort</option>
          <option value="insertion-sort">Insertion Sort</option>
          <option value="selection-sort">Selection Sort</option>
          <option value="merge-sort">Merge Sort</option>
          <option value="quick-sort">Quick Sort</option>
        </select>
        <Sort algorithm={sortingAlgorithm} />
      </div>
    </div>
  );
}
