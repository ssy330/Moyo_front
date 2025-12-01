import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Calendar, Receipt } from "lucide-react";

export default function PaymentInfoPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-emerald-600">
        <CreditCard className="h-6 w-6" />
        결제 정보
      </h2>

      {/* 기본 정보 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-neutral-700">구독 플랜</p>
          <p className="font-medium text-emerald-600">Moyo Premium</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-neutral-700">월 결제 금액</p>
          <p className="font-medium">₩9,900</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-neutral-700">다음 결제일</p>
          <p className="font-medium">2025-12-01</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-neutral-700">결제 수단</p>
          <p className="font-medium">카카오페이 (**** 1324)</p>
        </div>
      </div>

      <Separator className="my-8" />

      {/* 버튼 섹션 */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
        >
          <Calendar className="mr-2 h-4 w-4" />
          결제 내역 보기
        </Button>

        <Button
          variant="outline"
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
        >
          <Receipt className="mr-2 h-4 w-4" />
          영수증 다운로드
        </Button>

        <Button
          variant="destructive"
          className="w-full text-white hover:bg-red-600"
          onClick={() => confirm("구독을 해지하시겠습니까?")}
        >
          구독 해지하기
        </Button>
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        💡 구독 해지 후에도 남은 기간 동안은 서비스를 이용하실 수 있습니다.
      </p>
    </div>
  );
}
