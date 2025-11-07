import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-emerald-600">
        <FileText className="h-6 w-6" />
        이용약관
      </h2>

      <ScrollArea className="h-[70vh] pr-4">
        <div className="space-y-6 text-sm leading-relaxed text-neutral-700">
          <section>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              제1조 (목적)
            </h3>
            <p>
              본 약관은 Moyo(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의
              권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              제2조 (용어의 정의)
            </h3>
            <p>
              "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 개인
              또는 단체를 말합니다. "회원"은 그중 계정을 등록한 이용자를
              의미합니다.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              제3조 (약관의 효력 및 변경)
            </h3>
            <p>
              본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써
              효력이 발생합니다. 회사는 합리적인 사유가 있는 경우 본 약관을
              변경할 수 있으며, 변경된 약관은 공지 즉시 효력이 발생합니다.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              제4조 (서비스의 이용)
            </h3>
            <p>
              이용자는 본 약관 및 관계 법령을 준수하여야 하며, 회사는 서비스의
              품질 유지를 위해 필요한 경우 일부 서비스 이용을 제한할 수
              있습니다.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              제5조 (이용자의 의무)
            </h3>
            <ul className="list-disc pl-6">
              <li>타인의 정보를 도용하거나 허위 정보를 제공하지 않습니다.</li>
              <li>서비스 운영을 방해하는 행위를 하지 않습니다.</li>
              <li>법령 및 공공질서에 위반되는 내용을 게시하지 않습니다.</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              제6조 (면책 조항)
            </h3>
            <p>
              회사는 천재지변, 전쟁, 서버 장애 등 불가항력적인 사유로 인한
              서비스 중단에 대해서는 책임을 지지 않습니다.
            </p>
          </section>
        </div>
      </ScrollArea>

      <p className="mt-6 text-sm text-neutral-500">
        📄 본 이용약관은 2025년 1월 1일부터 시행됩니다.
      </p>
    </div>
  );
}
