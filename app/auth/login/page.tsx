"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { TwoFactorForm } from "@/components/auth/two-factor-form"
import { useAuth } from "@/lib/hooks/use-auth"

const loginSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [requireTwoFactor, setRequireTwoFactor] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    try {
      const result = await login(data.username, data.password)

      if (result.requireTwoFactor) {
        setRequireTwoFactor(true)
        setUserId(result.userId)
      } else {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Nom d'utilisateur ou mot de passe incorrect",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorSuccess = () => {
    toast({
      title: "Connexion réussie",
      description: "Vous êtes maintenant connecté",
    })
    router.push("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        {requireTwoFactor && userId ? (
          <TwoFactorForm userId={userId} onSuccess={handleTwoFactorSuccess} />
        ) : (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom d&apos;utilisateur</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez votre nom d'utilisateur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Entrez votre mot de passe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-center text-gray-500">
                Vous n&apos;avez pas de compte ?{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                  S&apos;inscrire
                </Link>
              </div>
              <div className="text-sm text-center text-gray-500">
                <Link href="/auth/forgot-password" className="text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
