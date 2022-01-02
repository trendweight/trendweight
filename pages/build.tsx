import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "lib/shared/Link";
import { Page } from "../lib/core/page";

const BuildDetails: Page = () => {
  if (!process.env.NEXT_PUBLIC_VERCEL_ENV) {
    return (
      <>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Key</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Environment</Td>
              <Td>Local Development</Td>
            </Tr>
          </Tbody>
        </Table>
      </>
    );
  } else {
    return (
      <>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Key</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Environment</Td>
              <Td>{process.env.NEXT_PUBLIC_VERCEL_ENV}</Td>
            </Tr>
            <Tr>
              <Td>URL</Td>
              <Td>{process.env.NEXT_PUBLIC_VERCEL_URL}</Td>
            </Tr>
            <Tr>
              <Td>Branch</Td>
              <Td>{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}</Td>
            </Tr>
            <Tr>
              <Td>Commit</Td>
              <Td>
                <Link
                  href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
                >
                  {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7)}
                </Link>
              </Td>
            </Tr>
            <Tr>
              <Td>Commit Message</Td>
              <Td>{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE}</Td>
            </Tr>
            <Tr>
              <Td>Build Time</Td>
              <Td>{new Date().toUTCString()}</Td>
            </Tr>
          </Tbody>
        </Table>
      </>
    );
  }
};

BuildDetails.title = "Build Details";
BuildDetails.requireLogin = false;

export default BuildDetails;
