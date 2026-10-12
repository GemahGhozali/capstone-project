import {
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";

import { useSwitchRole } from "@/features/auth/hooks";
import { SessionPayload } from "@/libs/session";
import { IconCheck, IconSwitch2 } from "@tabler/icons-react";

interface RoleSwitcherProps {
  session: SessionPayload;
}

export function RoleSwitcher({ session }: RoleSwitcherProps) {
  const { mutate: switchRole } = useSwitchRole();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <IconSwitch2 />
        Switch Role
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuGroup>
            {session.roles.map((role) => (
              <DropdownMenuItem key={role} onClick={() => switchRole(role)} disabled={session.currentRole === role}>
                {role}
                {session.currentRole === role && <IconCheck data-icon="inline-end" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
