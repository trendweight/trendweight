import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Stack, StackDivider, VStack } from "@chakra-ui/layout";
import { Input, Select } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { settingsQuery } from "~/lib/api/queries";
import { useTimezones } from "~/lib/utils/timezones";
import Loading from "../shared/Loading";
import SettingsGroup from "./SettingsGroup";

const Settings = () => {
  const query = useQuery(settingsQuery());
  const timezones = useTimezones();
  const form = useForm();

  if (query.isLoading || query.isIdle) {
    return <Loading />;
  }

  if (query.isError) {
    return <div>Error: {JSON.stringify(query.error, undefined, 2)}</div>;
  }

  return (
    <Stack spacing={4} divider={<StackDivider />}>
      <SettingsGroup title="Profile Settings">
        <VStack width="full" spacing={6}>
          <FormControl id="name">
            <FormLabel>First Name</FormLabel>
            <Input type="text" maxLength={255} maxW="xs" />
          </FormControl>
          <FormControl id="timezone">
            <FormLabel>Timezone</FormLabel>
            <Select value={Intl.DateTimeFormat().resolvedOptions().timeZone} maxW="xl">
              {timezones.map((tz) => (
                <option key={tz.id} value={tz.id}>
                  {tz.prefix} {tz.name}
                  {tz.abbrev ? ` (${tz.abbrev})` : ""}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="units">
            <FormLabel>Weight Units</FormLabel>
            <Input type="text" maxLength={255} />
          </FormControl>
        </VStack>
      </SettingsGroup>
    </Stack>
  );
};

export default Settings;
