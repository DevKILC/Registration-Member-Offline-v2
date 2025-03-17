import React from 'react';
import { useFormDataStore } from '@/app/hooks/useFormDataStore';

export default function PrivacyPolicy() {

    const { formData } = useFormDataStore();

    return (
        <div className='p-2'>
        <h1 style={{ fontSize: "1.8rem", textAlign: "start" }}>Syarat dan Ketentuan Kampung Inggris LC</h1>
        <p>
            Kamu harus meluangkan waktu untuk membaca Syarat dan Ketentuan ini sebelum mendaftar di Situs kami. Melakukan pendaftaran dengan memilih salah satu program kami (memesan), berarti Kamu setuju untuk terikat pada Syarat dan Ketentuan ini. Kamu harus mengunjungi halaman secara berkala untuk mengetahui setiap perubahan yang kami buat dalam Syarat dan Ketentuan kami.
        </p>
        <h2 style={{ fontSize: "1.5rem" }}>1. Definisi</h2>
        <p>Definisi dalam Syarat dan Ketentuan ini:</p>
        <ol className="list-decimal pl-11">
            <li>
                “<strong>Pendaftar</strong>” dalam syarat dan ketentuan ini adalah setiap orang yang menempatkan Pemesanan di Situs;
            </li>
            <li>
                “<strong>Pemesanan</strong>” dalam syarat dan ketentuan ini berarti Pemesanan yang diajukan oleh Kamu ke Situs untuk memesan Program dari kami;
            </li>
            <li>
                “<strong>Kamu</strong>” dalam syarat dan ketentuan ini berarti Pendaftar yang menempatkan Pemesanan dan telah menyelesaikan Pembayaran;
            </li>
            <li>
                “<strong>Pembayaran</strong>” dalam syarat dan ketentuan ini berarti Kamu yang telah menyelesaikan pembayaran DP sesuai dengan ketentuan.
            </li>
        </ol>
        <h2 style={{ fontSize: "1.5rem" }}>2. Persyaratan Penjualan</h2>
        <h3 style={{ fontSize: "1.2rem" }}>2.1 Pendaftaran</h3>
        <ol className="list-decimal pl-11">
            <li>
                Untuk melakukan Pemesanan, Kamu harus berusia lebih dari tujuh belas (17) tahun dan <strong>berkewarganegaraan Indonesia (WNI)</strong>. Jika Kamu berusia di bawah tujuh belas (17) tahun, Kamu dapat mendaftar di Kampung Inggris
                LC hanya dengan keterlibatan orangtua atau wali.
            </li>
            <li>Kamu wajib memberikan nama lengkap, alamat, email yang valid dan informasi lain yang dibutuhkan dalam proses pemesanan.</li>
            <li>Kamu harus menyimpan informasi terbaru dengan memberitahukan kepada kami jika ada perubahan apapun, dengan menggunakan bagian yang relevan dari Situs.</li>
            <li>Kamu tidak diijinkan menyalahgunakan Situs untuk melakukan pendaftaran palsu atau pun memberikan data diri palsu.</li>
            <li>
                Untuk mempermudah proses pembelajaran selama di Kampung Inggris LC, Kampung harus dalam <strong>keadaan sehat jasmani dan rohani</strong>, dan tidak memiliki hambatan dalam:
                <ol className="list-decimal pl-11">
                <li>penglihatan;</li>
                <li>pendengaran;</li>
                <li>fisik dan/atau motorik;</li>
                <li>intelektual;</li>
                <li>emosi dan perilaku;</li>
                <li>komunikasi;</li>
                <li>belajar dan/atau hambatan lainnya yang membutuhkan layanan pendidikan khusus;</li>
                </ol>
            </li>
            <li>
                Apabila <strong>Kamu terbukti memberikan data dan/atau informasi palsu</strong>, maka Kamu harus menerima konsekuensi sebagai berikut:
                <ol className="list-decimal pl-11">
                <li>pembatalan keikutsertaan sebagai siswa Kampung Inggris LC;</li>
                <li>pencabutan hak pada proses masuk dan/atau proses lainnya sebagai siswa Kampung Inggris LC.</li>
                </ol>
            </li>
            </ol>
            <h3 style={{ fontSize: "1.2rem" }}>2.2 Pembentukan Kontrak</h3>
            <ol className="list-decimal pl-11">
                <li>Informasi yang ditetapkan dalam Syarat dan Ketentuan dan rincian yang terdapat di Situs ini bukan merupakan suatu penawaran untuk dijual melainkan undangan untuk melindungi.</li>
                <li>Untuk melakukan Pemesanan, Kamu akan diminta untuk mengikuti proses yang telah ditetapkan. Setelah ini, Kamu akan menerima Konfirmasi Pesanan yang akan bertindak sebagai pengakuan Pesanan Kamu.</li>
            </ol>
            <h3 style={{ fontSize: "1.2rem" }}>2.3 Harga dan Pembayaran</h3>
            <p>
            Jika setelah Kamu melakukan pesanan dan kami menemukan kesalahan dalam harga setiap Program yang telah dipesan, kami akan memberikan informasi kepada Kamu tentang hal ini sesegera mungkin. Selanjutnya kami akan memberikan pilihan
            untuk mengkonfirmasi kembali Pemesanan dengan harga yang benar. Kamu bisa memilih melanjutkan Pemesan atau membatalkannya.
            </p>
            <p>Jika kami tidak dapat menghubungi Kamu, maka kami akan melakukan pembatalan pada Pesanan yang Kamu lakukan.</p>
            <p>Terkait Pembayaran berikut Syarat dan Ketentuannya</p>
            <ol className="list-decimal pl-11">
                <li>
                    <strong>Pembayaran (Uang Muka (DP)</strong> yang dibayarkan setelah Kamu melakukan Pemesanan) tidak bisa dikembalikan, kami hanya bisa mengubah periode kelas yang sudah Kamu pesan sebelumnya dengan ketentuan maksimal 3 kali
                    periode program
                </li>
                <li>
                    <strong>Pelunasan</strong> program setelah pembayaran DP maksimal H-3 (${"Jum'at"}) sebelum program dimulai (Transfer Bank atau Jaringan IDN)
                </li>
                <li>
                    Jika Kamu melakukan <strong>pembatalan Pemesanan</strong> setelah program dimulai maka Kamu tidak akan mendapatkan pengembalian biaya
                </li>
                <li>Kami tidak berkewajiban untuk memenuhi Pesanan Kamu jika harga yang tercantum di Situs ini tidak benar</li>
                <li>Kamu bisa melakukan Pembayaran menggunakan salah satu mitra pembayaran kami yang terdaftar di Situs kami (Transfer Bank dan Jaringan IDN)</li>
                <li>Jika peserta sudah mengikuti program namun tidak bisa melanjutkan dikarenakan kondisi tertentu, maka tidak ada pengembalian biaya maupun pindah ke program online.</li>
                <li>Pembatalan program antara 30 hari sampai 7 hari sebelum program dimulai, maka uang pembayaran program akan dikembalikan sebesar 80%.</li>
                <li>Pembatalan program antara 6 hari sampai 1 hari sebelum program dimulai, maka uang pembayaran program akan dikembalikan sebesar 50% (karena sudah digunakan untuk booking asrama).</li>
                <li>Pembatalan program di hari H atau setelahnya, maka tidak ada pengembalian biaya.</li>
                <li>Biaya admin bukan termasuk biaya program dan tidak ada pengembalian biaya admin.</li>
                <li>Konfirmasi pembatalan program hanya diterima oleh CS di jam operasional mulai jam 08:00 - 16:00 WIB.</li>
                <li>Jika peserta tidak ada konfirmasi kehadiran sampai 3 hari program dimulai, maka keikutsertaan Kamu akan dianggap batal dan tidak ada pengembalian biaya.</li>
                <li>Kami hanya bisa mengubah periode kelas yang sudah Kamu pesan sebelumnya dengan ketentuan maksimal 3 kali periode program dan hanya satu kali kesempatan saja.</li>
                {formData.cabang === "BOGOR" ? (
                    <li>
                        Apabila Kamu melakukan konfirmasi penjadwalan ulang (reschedule), maka berlaku ketentuan sebagai berikut (khusus Kampung Inggris LC Bogor):
                        <ol className="list-[lower-alpha] pl-11">
                            <li>Reschedule H-7 Sebelum Program Dimulai :
                                <ol className="list-disc pl-3">
                                    <li>Jika konfirmasi reschedule dilakukan paling lambat 7 (tujuh) hari sebelum program dimulai, maka tidak akan dikenakan biaya administrasi pembatalan program.</li>
                                    <li>Seluruh biaya yang telah dibayarkan akan dialihkan 100% (seratus persen) ke periode program berikutnya.</li>
                                </ol>
                            </li>
                            <li>
                                Reschedule H-6 hingga H-1 Sebelum Program Dimulai:
                                <ol className="list-disc pl-3">
                                    <li>Jika konfirmasi reschedule dilakukan antara 6 (enam) hari hingga 1 (satu) hari sebelum program dimulai, maka akan dikenakan biaya administrasi sebesar 10% (sepuluh persen) dari total biaya program.</li>
                                </ol>
                            </li>
                            <li>
                                Reschedule Pada Hari H atau Setelahnya:
                                <ol className="list-disc pl-3">
                                    <li>Jika konfirmasi reschedule dilakukan pada hari H atau setelah program dimulai, maka akan dikenakan biaya pembatalan sebesar 50% (lima puluh persen) dari harga program.</li>
                                    <li>
                                        Biaya yang dialihkan ke periode berikutnya hanya 50% (lima puluh persen).
                                    </li>
                                </ol>
                            </li>
                        </ol>
                    </li>
                ) : null }
            </ol>
            <h3 style={{ fontSize: "1.2rem" }}>2.4 Pesanan Keliru</h3>
            <p>Jika Kamu menyadari telah melakukan kesalahan ketika membuat Pesanan dan telah memasukkannya ke Situs, silahkan hubungi kami segera. Kami akan mencoba sebaik mungkin untuk memproses permintaan Kamu.</p>
            <h3 style={{ fontSize: "1.2rem" }}>2.5 Penolakan Pesanan</h3>
            <p>
            Penolakan Pesanan bisa kami lakukan dalam keadaan dan kondisi tertentu. Salah satunya adalah ketika
            <strong>KUOTA pendaftar PENUH</strong> dan informasi tersebut belum sampai ke Kamu.
            </p>
            <p>Kami akan menginformasikan tentang hal ini langsung setelah Pesanan yang Kamu lakukan masuk ke kami.</p>
            <h2 style={{ fontSize: "1.5rem" }}>3. Larangan</h2>
            <ol className="list-decimal pl-11">
                <li>Pendaftar tidak boleh menyalahgunakan Situs.</li>
                <li>Pendaftar dilarang mengirimkan segala macam worm, virus, kode yang bersifat merusak.</li>
                <li>Pelanggaran akan ketentuan ini akan mengakibatkan Pendaftar tidak bisa kembali mengakses Situs untuk melakukan pendaftaran.</li>
                <li>Mengirim iklan atau materi promosi yang tidak diminta; atau mencoba untuk mempengaruhi kinerja atau fungsi dari setiap fasilitas komputer atau akses terhadap seluruh Situs.</li>
                <li>
                    Setiap pelanggaran ketentuan di atas merupakan tindak pidana di bawah Undang-Undang Nomor 11 Tahun 2008 tentang Internet dan Transaksi Elektronik (ITE). Jika hal tersebut terjadi, Kampung Inggris LC akan melaporkan pelanggaran
                    kepada pihak penegak hukum yang berwenang dan akan diambil tindakan hukum yang tepat.
                </li>
                <li>Kamu dilarang mengambil kursus di lembaga lain selama menjadi siswa LC.</li>
                <li>Kamu dilarang tinggal di camp LC jika sudah tidak menjadi siswa LC / jika program yang ditempuh sudah berakhir.</li>
            </ol>
            <h2 style={{ fontSize: "1.5rem" }}>4. Keadaan Kahar (Force Majeure)</h2>
            <p>Kami tidak bertanggung jawab atas setiap pelanggaran, hambatan atau keterlambatan yang Kamu lakukan dalam pelaksanaan Kontrak disebabkan oleh apapun di luar kehendak kami, kecuali:</p>
            <ol className="list-decimal pl-11">
                <li>
                    Pemogokan, <em>lock-out</em> atau gangguan perusahaan lainnya.
                </li>
                <li>Keributan massa, kerusuhan, serangan teroris atau ancaman serangan teroris, ancaman perang atau perang (baik dinyatakan atau tidak).</li>
                <li>Kebakaran, ledakan, wabah, badai, banjir, atau bencana alam dan non alam lainnya.</li>
                <li>Adanya gangguan dalam alat transportasi penggunaan kereta api, pesawat pengirim, alat transportasi bermotor atau alat transportasi lainnya baik publik atau swasta.</li>
                <li>Adanya gangguan hingga terputusnya penggunaan jaringan telekomunikasi publik atau swasta.</li>
                <li>Adanya peraturan atau pembatasan dari pemerintah.</li>
            </ol>
            <p>Kami memiliki keputusan mutlak pada solusi yang kami ambil dalam memenuhi kewajiban kami.</p>
            <h2 style={{ fontSize: "1.5rem" }}>5. Hak Kekayaan Intelektual</h2>
            <ol className="list-decimal pl-11">
                <li>
                    Semua konten yang ada di Situs kami, mulai dari teks, grafik, logo, tombol ikon, video, gambar, klip audio, digital download, judul artikel dan data milik Kampung Inggris LC atau dari pengisi content pihak ke 3 dilindungi oleh
                    hukum hak cipta.
                </li>
                <li>
                    Kamu dapat menyimpan, mencetak dan menampilkan semua konten yang ada di Situs hanya untuk penggunaan pribadi. Kamu tidak diperbolehkan untuk melakukan publikasi, manipulasi, distribusi, reproduksi dalam format apapun untuk
                    digunakan dalam sebuah bisnis atau perusahaan komersial apapun.
                </li>
                <li>
                    Semua yang sudah disebutkan di poin pertama merupakan merek dagang dari Kampung Inggris LC baik di Indonesia maupun di negara-negara lain. Merek dagang Kampung Inggris LC tidak dapat digunakan dalam produk atau jasa yang tidak
                    ada kaitan atau hubungan dengan Kampung Inggris LC.
                </li>
                <li>Kamu tidak boleh menggunakan setiap bagian dari konten atau merek dagang di Situs kami untuk tujuan komersial tanpa memperoleh lisensi atau perizinan untuk melakukannya dari kami.</li>
                <li>Segala pelanggaran hak kekayaan intelektual yang kami temukan akan kami ambil tindakan hukum yang relevan.</li>
            </ol>
            <h1 style={{ fontSize: "1.8rem", textAlign: "start" }}>Kebijakan Privasi</h1>
            <p className='mt-2'>
            Kampung Inggris LC sebagai lembaga kursus bahasa inggris secara sengaja mengumpulkan data siswa melalui formulir pendaftaran yang telah kami sediakan. Data yang kami kumpulkan meliputi Nama Lengkap, Tempat Tanggal Lahir, Alamat
            Lengkap, No Telepon atau Handphone Pribadi dan Orang Tua/Wali, dan Alamat Email.
            </p>
            <p className='mt-2'>Data yang telah masuk dan Kampung Inggris LC kumpulkan akan digunakan dengan sebaik-baiknya untuk proses pengelolaan data siswa (dan alumni) dan juga proses promosi langsung melalui email atau kontak dari yang bersangkutan.</p>
            <p className='mt-2'>Kampung Inggris LC tidak akan menjual, menukar atau memperlihatkan segala informasi (data lengkap) yang berkaitan dengan siswa atau pengunjung situs Kampung Inggris LC.</p>
        </div>
    );
}
