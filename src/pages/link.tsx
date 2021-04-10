import { useState } from "react";
import Button from "~/components/shared/Button";
import { get } from "~/lib/api/fetch";
import { Page } from "~/lib/core/page";

const LinkAccount: Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const onLinkWithings = async () => {
    setIsLoading(true);
    const { authorizationUrl } = await get<{ authorizationUrl: string }>("/api/withings/link");
    window.location.assign(authorizationUrl);
  };
  return (
    <div>
      <Button onClick={onLinkWithings} isLoading={isLoading}>
        Link Withings Account
      </Button>
    </div>
  );
};

LinkAccount.title = "Link Account";
LinkAccount.requireLogin = true;

export default LinkAccount;
