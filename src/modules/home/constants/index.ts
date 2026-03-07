import { Calendar, Plug, ClipboardList } from "lucide-react";
import { DashboardCard } from "../component/card";

const DATA = [
  { title: "Freshdesk Tickets",  description: "View and manage support tickets",   buttonText: "View Tickets", buttonVariant: "blue",  route: "/dashboard/tickets", variant: "blue",         icon: Calendar    },
  { title: "Connect Accounts",   description: "Link Freshdesk & HubSpot accounts", buttonText: "Connect Now",  buttonVariant: "green", route: "/dashboard/connect", variant: "green",        icon: Plug        },
  { title: "Quick Actions",      variant: "border-blue",  icon: ClipboardList, list: ["View ticket conversations", "Look up HubSpot contacts", "Monitor webhook events"] },
  { title: "Webhook Logs",       variant: "border-green", icon: ClipboardList, list: ["Real-time Freshdesk events", "Timestamped event payloads", "Filter by event type"]  },
];

export const DASHBOARD_CARDS: DashboardCard[] = DATA.map((card) => ({
  description: null, buttonText: null, buttonVariant: null, route: null, list: null,
  ...card,
})) as DashboardCard[];
