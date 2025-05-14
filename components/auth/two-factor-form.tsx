"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/hooks/use-auth"

const twoFactorSchema = z.object({
  code: z.string().length(6, "Le code doit contenir 6 chiffres"),
})

interface TwoFactorFormProps {
  userId: string
  onSuccess: () => void
}

export function TwoFactorForm({ userId, onSuccess }: TwoFactorFormProps) {
  const { toast } = useToast()
  const { verifyTwoFactorCode } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: z.infer<typeof twoFactorSchema>) {
    setIsLoading(true)
    try {
      await verifyTwoFactorCode(userId, data.code)
      onSuccess()
    } catch (error) {
      console.error("Erreur de vérification 2FA:", error)
      toast({
        variant: "destructive",
        title: "Erreur de vérification",
        description: "Code incorrect ou expiré",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Authentification à deux facteurs</CardTitle>
        <CardDescription>Entrez le code à 6 chiffres envoyé à votre adresse email</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code de vérification</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez le code à 6 chiffres"
                      {...field}
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Vérification..." : "Vérifier"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
