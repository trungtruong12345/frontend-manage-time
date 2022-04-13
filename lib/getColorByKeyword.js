const wordWithColor = [
  {
    words: "qw12-",
    color: "#fdcb6e",
  },
  {
    words: "tyuf34e[{",
    color: "#ffeaa7",
  },
  {
    words: "pas56|",
    color: "#b2bec3",
  },
  {
    words: "gjk78l",
    color: "#a29bfe",
  },
  {
    words: "lzx9='",
    color: "#74b9ff",
  },
  {
    words: "vbc0/",
    color: "#55efc4",
  },
  {
    words: "mdn[].",
    color: "#fab1a0",
  },
  {
    words: "ior,h",
    color: "#ff7675",
  },
];
export default function (keyword = "") {
  let color = '#bbbabf'
  wordWithColor.forEach(item => {
    if (item.words.split('').includes(keyword.toLowerCase())) {
      color = item.color
    }
  })
  return color;
}
