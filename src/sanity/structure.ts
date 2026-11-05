import {
  BoltIcon,
  CaseIcon,
  CogIcon,
  ComposeIcon,
  DocumentIcon,
  EnvelopeIcon,
  HomeIcon,
  LinkIcon,
  OlistIcon,
  PinIcon,
  TransferIcon,
} from "@/sanity/icons";
import type { StructureResolver } from "sanity/structure";

import { singletonTypes } from "@/sanity/schemaTypes";

const singletonIds: Set<string> = new Set(singletonTypes);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Macap")
    .items([
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings")),
      S.divider(),
      S.listItem()
        .title("Front page")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage").title("Front page")),
      S.listItem()
        .title("Home grinders journey")
        .icon(HomeIcon)
        .child(
          S.documentList()
            .title("Home grinders")
            .filter('_type == "journeyPage" && slug.current == "home-grinders"')
            .apiVersion("2026-02-01"),
        ),
      S.listItem()
        .title("Professional journey")
        .icon(TransferIcon)
        .child(
          S.documentList()
            .title("Professional")
            .filter('_type == "journeyPage" && slug.current == "professional"')
            .apiVersion("2026-02-01"),
        ),
      S.documentTypeListItem("journeyPage").title("All journeys"),
      S.listItem()
        .title("About")
        .icon(DocumentIcon)
        .child(S.document().schemaType("aboutPage").documentId("aboutPage").title("About")),
      S.listItem()
        .title("Contact")
        .icon(EnvelopeIcon)
        .child(S.document().schemaType("contactPage").documentId("contactPage").title("Contact")),
      S.documentTypeListItem("distributor").title("Distributors").icon(PinIcon),
      S.divider(),
      S.listItem()
        .title("Grinders")
        .icon(CaseIcon)
        .child(
          S.list()
            .title("Grinders")
            .items([
              S.listItem()
                .title("Grinders index")
                .icon(OlistIcon)
                .child(
                  S.document()
                    .schemaType("grindersIndexPage")
                    .documentId("grindersIndexPage")
                    .title("Grinders index"),
                ),
              S.documentTypeListItem("grinder").title("All grinders"),
              S.documentTypeListItem("grinderGroup").title("Groups"),
              S.documentTypeListItem("grinderCollection").title("Collections"),
            ]),
        ),
      S.listItem()
        .title("Knowledge base")
        .icon(ComposeIcon)
        .child(
          S.list()
            .title("Knowledge base")
            .items([
              S.listItem()
                .title("Hub page")
                .icon(ComposeIcon)
                .child(
                  S.document()
                    .schemaType("knowledgeHubPage")
                    .documentId("knowledgeHubPage")
                    .title("Knowledge hub"),
                ),
              S.documentTypeListItem("kbPost").title("Posts"),
              S.documentTypeListItem("kbTopic").title("Topics"),
              S.documentTypeListItem("author").title("Authors"),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Legal pages").icon(DocumentIcon),
      S.documentTypeListItem("redirect").title("Redirects").icon(LinkIcon),
      S.documentTypeListItem("experiment").title("Experiments (not live)").icon(BoltIcon),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return id
          ? !singletonIds.has(id) && id !== "journeyPage" && id !== "distributor" && id !== "experiment"
          : false;
      }),
    ]);
