import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCreateGroup } from "@/hooks/mutation/group/use-create-group";
import StepIndicator, {
  type Step,
} from "@/components/GroupsPageComponents/StepIndicator";
import Step1 from "@/components/GroupsPageComponents/GroupCreateStep/Step1";
import Step2 from "@/components/GroupsPageComponents/GroupCreateStep/Step2";
import Step3 from "@/components/GroupsPageComponents/GroupCreateStep/Step3";

export default function GroupCreatePage() {
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  const [approval, setApproval] = useState<"auto" | "manual">("auto");
  const [nicknameAllowed, setNicknameAllowed] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const { mutate: createGroup, isPending: createGroupIsPending } =
    useCreateGroup();

  // 1단계는 이름 + 개인정보 동의
  const isStep1Valid = groupName.trim() !== "" && privacy === true;
  // 3단계는 설명만
  const isStep3Valid = description.trim() !== "" && !createGroupIsPending;

  const goToStep = (next: Step) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleCreate = () => {
    if (!isStep3Valid) return;

    const formData = new FormData();
    formData.append("name", groupName.trim());
    formData.append("description", description.trim());
    formData.append("requires_approval", String(approval === "manual"));
    formData.append("identity_mode", nicknameAllowed ? "nickname" : "realname");
    if (image) formData.append("image", image);

    createGroup(formData);
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center px-4">
      <div className="border-border bg-card flex w-full max-w-7xl overflow-hidden rounded-3xl border shadow-xl">
        {/* 왼쪽: 컨텐츠 영역 */}
        <div className="flex-1 px-8 py-8 md:px-12 md:py-10">
          {/* 상단 헤더 */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
                MOYO GROUP
              </p>
              <h1 className="mt-2 text-2xl leading-tight font-semibold lg:text-2xl">
                <span className="block md:inline">나만의 모임을</span>
                <span className="block md:inline"> 시작해보세요</span>
              </h1>
            </div>
            <StepIndicator step={step} />
          </div>

          {/* 단계별 내용 + 애니메이션 */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ x: direction === 1 ? 40 : -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 1 ? -40 : 40, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {step === 1 && (
                <Step1
                  groupName={groupName}
                  setGroupName={setGroupName}
                  privacy={privacy}
                  setPrivacy={setPrivacy}
                  isStep1Valid={isStep1Valid}
                  onNext={() => goToStep(2)}
                />
              )}

              {step === 2 && (
                <Step2
                  image={image}
                  setImage={setImage}
                  onPrev={() => goToStep(1)}
                  onNext={() => goToStep(3)}
                />
              )}

              {step === 3 && (
                <Step3
                  approval={approval}
                  setApproval={setApproval}
                  nicknameAllowed={nicknameAllowed}
                  setNicknameAllowed={setNicknameAllowed}
                  description={description}
                  setDescription={setDescription}
                  isStep3Valid={isStep3Valid}
                  onPrev={() => goToStep(2)}
                  onSubmit={handleCreate}
                  createGroupIsPending={createGroupIsPending}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 오른쪽: 밝은 데코 패널 */}
        <div className="from-primary/5 via-primary/10 to-primary/5 relative hidden w-72 flex-col items-center justify-center bg-linear-to-b md:flex" />
      </div>
    </div>
  );
}
