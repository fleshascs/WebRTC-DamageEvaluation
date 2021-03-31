import { useEffect, useState } from "react";
import { accountService } from "../../services";
import { User } from "../../services/types";

export const useUser = () => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const subscription = accountService.user.subscribe((x) => setUser(x));
    return () => subscription?.unsubscribe();
  }, []);

  return user;
};
