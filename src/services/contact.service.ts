import prisma from "../prisma/client";
import { Contact as ContactModel } from "@prisma/client";

type Contact = ContactModel;

type ContactResponse = {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
};

const contactService = {
  async identify(
    email?: string,
    phoneNumber?: string
  ): Promise<ContactResponse> {
    if (!email && !phoneNumber) {
      throw new Error("At least one of email or phoneNumber must be provided.");
    }

   // To Find all contacts that match email or phoneNumber
    const matchedContacts: Contact[] = await prisma.contact.findMany({
      where: {
        OR: [
          { email: email || undefined },
          { phoneNumber: phoneNumber || undefined },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    let allLinkedContacts: Contact[] = [...matchedContacts];

    // If there no match found, then we will create a new primary contact
    if (matchedContacts.length === 0) {
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: "primary",
        },
      });

      return {
        primaryContactId: newContact.id,
        emails: [newContact.email || ""],
        phoneNumbers: [newContact.phoneNumber || ""],
        secondaryContactIds: [],
      };
    }

    // To get full chain of related contacts
    const rootContactIds = matchedContacts.map((c) => c.id);
    const linkedIds = matchedContacts
      .filter((c) => c.linkedId !== null)
      .map((c) => c.linkedId!) as number[];

    const allContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { id: { in: [...rootContactIds, ...linkedIds] } },
          { linkedId: { in: [...rootContactIds, ...linkedIds] } },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    allLinkedContacts = allContacts;

    // To resolve the oldest primary
    const primaries = allLinkedContacts.filter(
      (c) => c.linkPrecedence === "primary"
    );
    const primary = primaries[0];

    // To demote any newer primaries to secondary
    for (const p of primaries.slice(1)) {
      await prisma.contact.update({
        where: { id: p.id },
        data: {
          linkPrecedence: "secondary",
          linkedId: primary.id,
        },
      });
    }

    // If new info (email or phone not in linked contacts),then we will create secondary contact
    const alreadyExists = allLinkedContacts.some(
      (c) =>
        (email ? c.email === email : true) &&
        (phoneNumber ? c.phoneNumber === phoneNumber : true)
    );

    if (!alreadyExists) {
      const newSecondary = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: "secondary",
          linkedId: primary.id,
        },
      });

      allLinkedContacts.push(newSecondary);
    }

    // To prepare final response
    const emails = [
      ...new Set(
        allLinkedContacts.map((c) => c.email).filter(Boolean) as string[]
      ),
    ];
    const phoneNumbers = [
      ...new Set(
        allLinkedContacts.map((c) => c.phoneNumber).filter(Boolean) as string[]
      ),
    ];
    const secondaryContactIds = allLinkedContacts
      .filter((c) => c.linkPrecedence === "secondary")
      .map((c) => c.id);

    return {
      primaryContactId: primary.id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    };
  },
};

export default contactService;
