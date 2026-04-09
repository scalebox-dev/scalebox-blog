import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { BookOpen, FileCode, Terminal, Package, ExternalLink } from 'lucide-react';
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from 'fumadocs-ui/layouts/home/navbar';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      url: '/',
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      // Mobile menu dropdown
      {
        type: 'menu',
        on: 'menu',
        text: 'Documentation',
        items: [
          { text: 'Guides', url: 'https://docs.scalebox.dev/en/guides', external: true, icon: <BookOpen className="size-4" /> },
          { text: 'API Reference', url: 'https://docs.scalebox.dev/en/api', external: true, icon: <FileCode className="size-4" /> },
          { text: 'CLI', url: 'https://docs.scalebox.dev/en/cli', external: true, icon: <Terminal className="size-4" /> },
          { text: 'Python SDK', url: 'https://github.com/scalebox-dev/scalebox-sdk-python', external: true, icon: <Package className="size-4" /> },
          { text: 'JS SDK', url: 'https://github.com/scalebox-dev/scalebox-sdk-js', external: true, icon: <Package className="size-4" /> },
          { text: 'Golang SDK', url: 'https://github.com/scalebox-dev/scalebox-sdk-golang', external: true, icon: <Package className="size-4" /> },
        ],
      },
      // Desktop navbar dropdown
      {
        type: 'custom',
        on: 'nav',
        children: (
          <NavbarMenu>
            <NavbarMenuTrigger>
              <a href="https://docs.scalebox.dev/en/guides">Documentation</a>
            </NavbarMenuTrigger>
            <NavbarMenuContent>
              <NavbarMenuLink href="https://docs.scalebox.dev/en/guides" external>
                <BookOpen className="size-5 text-fd-muted-foreground" />
                <p className="font-medium">Guides</p>
                <p className="text-fd-muted-foreground text-sm">Tutorials and getting started</p>
              </NavbarMenuLink>
              <NavbarMenuLink href="https://docs.scalebox.dev/en/api" external>
                <FileCode className="size-5 text-fd-muted-foreground" />
                <p className="font-medium">API Reference</p>
                <p className="text-fd-muted-foreground text-sm">Complete REST API docs</p>
              </NavbarMenuLink>
              <NavbarMenuLink href="https://docs.scalebox.dev/en/cli" external>
                <Terminal className="size-5 text-fd-muted-foreground" />
                <p className="font-medium">CLI</p>
                <p className="text-fd-muted-foreground text-sm">Command-line interface reference</p>
              </NavbarMenuLink>
              <NavbarMenuLink href="https://github.com/scalebox-dev/scalebox-sdk-python" external>
                <Package className="size-5 text-fd-muted-foreground" />
                <p className="font-medium">Python SDK</p>
                <p className="text-fd-muted-foreground text-sm">Python client library</p>
              </NavbarMenuLink>
              <NavbarMenuLink href="https://github.com/scalebox-dev/scalebox-sdk-js" external>
                <Package className="size-5 text-fd-muted-foreground" />
                <p className="font-medium">JS SDK</p>
                <p className="text-fd-muted-foreground text-sm">JavaScript/TypeScript client</p>
              </NavbarMenuLink>
              <NavbarMenuLink href="https://github.com/scalebox-dev/scalebox-sdk-golang" external>
                <Package className="size-5 text-fd-muted-foreground" />
                <p className="font-medium">Golang SDK</p>
                <p className="text-fd-muted-foreground text-sm">Go client library</p>
              </NavbarMenuLink>
            </NavbarMenuContent>
          </NavbarMenu>
        ),
      },
      {
        type: 'custom',
        secondary: true,
        children: (
          <a
            href="https://www.scalebox.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-fd-primary px-4 py-1.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-80"
          >
            Go to ScaleBox
            <ExternalLink className="size-3.5" />
          </a>
        ),
      },
    ],
  };
}
