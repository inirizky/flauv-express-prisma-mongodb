let nama = "Rizky";

console.log("Hello World", nama);

nama = "ABC";

console.log("Hello Ganti Nama", nama);

const nilai = 95;

console.log(nilai >= 90 ? "Lulus" : "Tidak Lulus");

let i = 1;

const mahasiswa = {
  nama: "Rizky",
  npm: "23411087",
};

console.log(mahasiswa.nama);

const hobby = ["makan", "nyanyi", "tidur"];

const mahasiswa2 = [
  {
    id: 1,
    nama: "Andi Saputra",
    nim: "20231001",
    jurusan: "Teknik Informatika",
    angkatan: 2023,
  },
  {
    id: 2,
    nama: "Budi Santoso",
    nim: "20231002",
    jurusan: "Sistem Informasi",
    angkatan: 2023,
  },
  {
    id: 3,
    nama: "Citra Dewi",
    nim: "20231003",
    jurusan: "Teknik Komputer",
    angkatan: 2023,
  },
  {
    id: 4,
    nama: "Dina Maharani",
    nim: "20231004",
    jurusan: "Manajemen Informatika",
    angkatan: 2023,
  },
  {
    id: 5,
    nama: "Eko Prasetyo",
    nim: "20231005",
    jurusan: "Teknik Elektro",
    angkatan: 2023,
  },
];

console.log(mahasiswa2[0].nama);

for (const mhs of mahasiswa2) {
  console.log(mhs.nama);
}

console.log(mahasiswa2.map((i) => i.nama));
