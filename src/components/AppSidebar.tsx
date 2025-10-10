'use client';

/* eslint-disable @typescript-eslint/no-unused-vars*/
import {
  Brush,
  Home,
  Box,
  Cat,
  Eclipse,
  Frown,
  Heart,
  Star,
  Layers,
  WandSparkles,
  Citrus,
  AlarmClock,
  Cherry,
  Drum,
  Plus,
  LucideIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { Button } from './ui/button';
import NewPageDialog from './tasks/dialogs/NewPageDialog';
import { useEffect, useState } from 'react';

interface SidebarItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

// Icon mapping function
const getIconComponent = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    brush: Brush,
    home: Home,
    box: Box,
    cat: Cat,
    eclipse: Eclipse,
    frown: Frown,
    heart: Heart,
    star: Star,
    layers: Layers,
    wandsparkles: WandSparkles,
    citrus: Citrus,
    alarmclock: AlarmClock,
    cherry: Cherry,
    drum: Drum,
  };

  return iconMap[iconName.toLowerCase()] || Home; // Default to Home if icon not found
};

const AppSidebar = () => {
  const [items, setItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch('/api/pages');
      const data = await response.json();

      // Convert the API data to SidebarItem format
      const sidebarItems: SidebarItem[] = data.map((page: any) => ({
        name: page.name,
        url: `/${page.name.toLowerCase().replace(/\s+/g, '-')}`,
        icon: getIconComponent(page.icon),
      }));

      setItems(sidebarItems);
    };

    fetchItems();
  }, []);

  const onSuccess = (name: string, icon: string) => {
    const newItem: SidebarItem = {
      name: name,
      url: `/${name.toLowerCase().replace(/\s+/g, '-')}`,
      icon: getIconComponent(icon),
    };
    setItems([...items, newItem]);
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-zinc-800 text-slate-200">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-200">FranciTask</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-zinc-800">
        <NewPageDialog onSuccess={onSuccess}>
          <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-slate-200">
            <Plus size={16} className="mr-2" />
            New Page
          </Button>
        </NewPageDialog>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
