import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createAccount, login } from "@/lib/appwrite";
import { useToast } from "@/components/ui/use-toast";
import { PortfolioManager } from "./PortfolioManager";

export const AuthDialog = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        await createAccount(email, password, name);
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        setShowPortfolio(true);
      }
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-crypto-card/30 hover:bg-crypto-card/40 border-white/10">
            Sign {isLogin ? "In" : "Up"}
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-card border-none sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">{isLogin ? "Sign In" : "Create Account"}</DialogTitle>
            <DialogDescription className="text-crypto-gray">
              {isLogin
                ? "Enter your credentials to sign in"
                : "Fill in your details to create an account"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-crypto-card/30 border-white/10 text-white placeholder:text-crypto-gray"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="bg-crypto-card/30 border-white/10 text-white placeholder:text-crypto-gray"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-crypto-card/30 border-white/10 text-white"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <Button type="submit" className="bg-crypto-purple hover:bg-crypto-accent">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-crypto-gray hover:text-white hover:bg-crypto-card/40"
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {showPortfolio && <PortfolioManager />}
    </>
  );
};