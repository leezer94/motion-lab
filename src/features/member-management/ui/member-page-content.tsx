"use client";

import { FormProvider } from "react-hook-form";
import { useState } from "react";
import { useMemberFilter } from "../lib/use-member-filter";
import { MemberTabs } from "./member-tabs";
import { MemberFilterForm } from "./member-filter-form";
import { StudentView } from "./student-view";
import { InstructorView } from "./instructor-view";
import { VolunteerView } from "./volunteer-view";
import type { MemberRole } from "../model/members";

/**
 * 회원 관리 페이지 메인 컨텐츠 컴포넌트
 */
export function MemberPageContent() {
  const { form, watch } = useMemberFilter();
  const filterValues = watch();
  const [activeRole, setActiveRole] = useState<MemberRole | "all">("all");

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {/* 역할 탭 */}
        <MemberTabs activeRole={activeRole} onRoleChange={setActiveRole} />

        {/* 필터 폼 */}
        <MemberFilterForm />

        {/* 역할별 뷰 */}
        {activeRole === "student" && <StudentView filterValues={filterValues} />}
        {activeRole === "instructor" && <InstructorView filterValues={filterValues} />}
        {activeRole === "volunteer" && <VolunteerView filterValues={filterValues} />}
        {activeRole === "all" && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                학생
              </h3>
              <StudentView filterValues={filterValues} />
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                강의자
              </h3>
              <InstructorView filterValues={filterValues} />
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                봉사자
              </h3>
              <VolunteerView filterValues={filterValues} />
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
}
