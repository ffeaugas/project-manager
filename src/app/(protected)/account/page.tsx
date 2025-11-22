import { getUser } from '@/lib/auth-server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Account() {
  const user = await getUser();

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center">
      <Card className="w-[400px] bg-background">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col items-start justify-start w-full gap-1">
            <h2 className="text-sm text-foreground">Name</h2>
            <p className="text-sm">{user?.name}</p>
          </div>
          <div className="flex flex-col items-start justify-start w-full gap-1">
            <h2 className="text-sm text-foreground">Email</h2>
            <p className="text-sm">{user?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
