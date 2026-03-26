"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AccountFormProps {
  user: {
    id: string;
    email: string;
    plan: string;
    createdAt: string;
    hasPassword: boolean;
    providers: string[];
  };
}

export function AccountForm({ user }: AccountFormProps) {
  const router = useRouter();
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingPassword(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("new-password") as string;
    const confirm = formData.get("confirm-password") as string;

    if (password !== confirm) {
      toast.error("Şifreler eşleşmiyor.");
      setLoadingPassword(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı.");
      setLoadingPassword(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Şifre başarıyla güncellendi.");
      (e.target as HTMLFormElement).reset();
    }

    setLoadingPassword(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Profil bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil</CardTitle>
          <CardDescription>Hesap bilgileriniz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">E-posta</Label>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Plan</Label>
              <div>
                <Badge
                  variant={user.plan === "pro" ? "default" : "secondary"}
                >
                  {user.plan === "pro" ? "Pro" : "Free"}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Kayıt Tarihi</Label>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">
                Giriş Yöntemleri
              </Label>
              <div className="flex gap-1">
                {user.providers.map((p) => (
                  <Badge key={p} variant="outline" className="text-xs">
                    {p === "email" ? "E-posta" : p}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Şifre değiştir */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {user.hasPassword ? "Şifre Değiştir" : "Şifre Belirle"}
          </CardTitle>
          <CardDescription>
            {user.hasPassword
              ? "Hesabınızın şifresini güncelleyin"
              : "E-posta giriş için bir şifre belirleyin"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Yeni Şifre</Label>
              <Input
                id="new-password"
                name="new-password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Şifre Tekrar</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={loadingPassword}>
              {loadingPassword && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {user.hasPassword ? "Şifreyi Güncelle" : "Şifre Belirle"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Oturum */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Oturum</CardTitle>
          <CardDescription>
            Tüm cihazlarda oturumunuzu kapatın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOut}>
            Çıkış Yap
          </Button>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive text-base">
            Tehlikeli Alan
          </CardTitle>
          <CardDescription>
            Bu işlemler geri alınamaz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            Hesabı Sil (Yakında)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
