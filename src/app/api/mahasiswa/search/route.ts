import { getSession } from "@/libs/session";
import { NextRequest } from "next/server";
import { searchInvitableMahasiswa } from "@/features/tim/queries";

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return Response.json({ message: "Anda belum terautentikasi! Silahkan login terlebih dahulu." }, { status: 401 });
    }

    const userNotResetAccountYet = !user.isAccountReset;

    if (userNotResetAccountYet) {
      return Response.json(
        {
          message:
            "Akun anda belum diaktivasi/direset! Silakan login terlebih dahulu menggunakan NIM/NIP dan password default yang diberikan, kemudian reset akun anda.",
        },
        { status: 403 },
      );
    }

    const userNotMahasiswa = user.currentRole !== "Mahasiswa";

    if (userNotMahasiswa) {
      return Response.json({ message: "Hanya mahasiswa yang bisa melakukan pencarian anggota!" }, { status: 403 });
    }

    const query = (request.nextUrl.searchParams.get("q") ?? "").trim();

    if (query.length < 1) return Response.json([]);

    const results = await searchInvitableMahasiswa({ query, authenticatedMahasiswaId: user.userId });

    return Response.json(results);
  } catch (error) {
    return Response.json({ message: "Terjadi kesalahan pada server!" }, { status: 500 });
  }
}
