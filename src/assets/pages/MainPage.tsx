import Category from "../../components/Category";
import nextId from "../helpers/nextId";

export default function MainPage() {
  return (
    <div>
      <Category
        id={nextId()}
        name="Sorting Algorithms"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, magnam."
        value="sorting"
      />
      <Category
        id={nextId()}
        name="Searching Algorithms"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, magnam."
        value="searching"
      />
    </div>
  );
}
