let count = 0;
export default function nextId() {
  count += 1;
  return count + "";
}
