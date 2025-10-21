"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Users,
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  Bell,
  Palette,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { useTenant } from "@/contexts/tenant-context";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
}

interface RoomData {
  name: string;
  capacity: number;
  location: string;
  floor: number;
  description: string;
  equipment: string[];
}

export default function GuidedSetupPage() {
  const { tenant, isLoading: tenantLoading } = useTenant();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [setupData, setSetupData] = useState({
    // Informations de l'entreprise
    companyInfo: {
      description: "",
      website: "",
      phone: "",
      address: {
        street: "",
        city: "",
        postalCode: "",
        country: "France",
      },
    },
    // Salles
    rooms: [] as RoomData[],
    // Paramètres
    settings: {
      timezone: "Europe/Paris",
      language: "fr",
      currency: "EUR",
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      booking: {
        advanceBooking: 30, // jours
        maxBookingDuration: 8, // heures
        requireApproval: false,
        allowRecurring: true,
      },
    },
    // Personnalisation
    branding: {
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      logo: "",
      favicon: "",
    },
  });

  const steps: SetupStep[] = [
    {
      id: "company",
      title: "Informations de l'Entreprise",
      description: "Complétez les détails de votre organisation",
      icon: Building2,
      completed: false,
    },
    {
      id: "rooms",
      title: "Configuration des Salles",
      description: "Ajoutez vos salles de réunion",
      icon: MapPin,
      completed: false,
    },
    {
      id: "settings",
      title: "Paramètres de Réservation",
      description: "Configurez les règles de réservation",
      icon: Settings,
      completed: false,
    },
    {
      id: "branding",
      title: "Personnalisation",
      description: "Adaptez l'interface à votre marque",
      icon: Palette,
      completed: false,
    },
    {
      id: "team",
      title: "Inviter votre Équipe",
      description: "Ajoutez les membres de votre équipe",
      icon: Users,
      completed: false,
    },
  ];

  useEffect(() => {
    // Marquer les étapes comme complétées selon les données existantes
    const completedSteps = [...steps];

    if (setupData.companyInfo.description) {
      completedSteps[0].completed = true;
    }
    if (setupData.rooms.length > 0) {
      completedSteps[1].completed = true;
    }
    if (setupData.settings.booking.advanceBooking > 0) {
      completedSteps[2].completed = true;
    }
    if (setupData.branding.primaryColor !== "#3b82f6") {
      completedSteps[3].completed = true;
    }

    // Mettre à jour les étapes (cette logique serait dans un état local)
  }, [setupData]);

  const addRoom = () => {
    const newRoom: RoomData = {
      name: "",
      capacity: 8,
      location: "",
      floor: 1,
      description: "",
      equipment: [],
    };
    setSetupData((prev) => ({
      ...prev,
      rooms: [...prev.rooms, newRoom],
    }));
  };

  const updateRoom = (index: number, field: keyof RoomData, value: any) => {
    setSetupData((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room, i) =>
        i === index ? { ...room, [field]: value } : room
      ),
    }));
  };

  const removeRoom = (index: number) => {
    setSetupData((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveSetup = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/setup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setupData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      toast.success("Configuration terminée avec succès !");

      // Rediriger vers le dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde de la configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">
                Informations de l'Entreprise
              </h3>
              <p className="text-gray-600">
                Complétez les détails de votre organisation
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description de l'entreprise</Label>
                <Textarea
                  id="description"
                  value={setupData.companyInfo.description}
                  onChange={(e) =>
                    setSetupData((prev) => ({
                      ...prev,
                      companyInfo: {
                        ...prev.companyInfo,
                        description: e.target.value,
                      },
                    }))
                  }
                  placeholder="Décrivez votre entreprise en quelques mots..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={setupData.companyInfo.website}
                    onChange={(e) =>
                      setSetupData((prev) => ({
                        ...prev,
                        companyInfo: {
                          ...prev.companyInfo,
                          website: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://votre-entreprise.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={setupData.companyInfo.phone}
                    onChange={(e) =>
                      setSetupData((prev) => ({
                        ...prev,
                        companyInfo: {
                          ...prev.companyInfo,
                          phone: e.target.value,
                        },
                      }))
                    }
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Adresse</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Rue</Label>
                    <Input
                      id="street"
                      value={setupData.companyInfo.address.street}
                      onChange={(e) =>
                        setSetupData((prev) => ({
                          ...prev,
                          companyInfo: {
                            ...prev.companyInfo,
                            address: {
                              ...prev.companyInfo.address,
                              street: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="123 Rue de la Paix"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={setupData.companyInfo.address.city}
                      onChange={(e) =>
                        setSetupData((prev) => ({
                          ...prev,
                          companyInfo: {
                            ...prev.companyInfo,
                            address: {
                              ...prev.companyInfo.address,
                              city: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="Paris"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      value={setupData.companyInfo.address.postalCode}
                      onChange={(e) =>
                        setSetupData((prev) => ({
                          ...prev,
                          companyInfo: {
                            ...prev.companyInfo,
                            address: {
                              ...prev.companyInfo.address,
                              postalCode: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="75001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={setupData.companyInfo.address.country}
                      onChange={(e) =>
                        setSetupData((prev) => ({
                          ...prev,
                          companyInfo: {
                            ...prev.companyInfo,
                            address: {
                              ...prev.companyInfo.address,
                              country: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="France"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">
                Configuration des Salles
              </h3>
              <p className="text-gray-600">Ajoutez vos salles de réunion</p>
            </div>

            <div className="space-y-4">
              {setupData.rooms.map((room, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Salle {index + 1}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRoom(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom de la salle</Label>
                        <Input
                          value={room.name}
                          onChange={(e) =>
                            updateRoom(index, "name", e.target.value)
                          }
                          placeholder="Ex: Salle de Réunion A"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Capacité</Label>
                        <Input
                          type="number"
                          value={room.capacity}
                          onChange={(e) =>
                            updateRoom(
                              index,
                              "capacity",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="8"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Emplacement</Label>
                        <Input
                          value={room.location}
                          onChange={(e) =>
                            updateRoom(index, "location", e.target.value)
                          }
                          placeholder="Ex: Étage 1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Étage</Label>
                        <Input
                          type="number"
                          value={room.floor}
                          onChange={(e) =>
                            updateRoom(index, "floor", parseInt(e.target.value))
                          }
                          placeholder="1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={room.description}
                        onChange={(e) =>
                          updateRoom(index, "description", e.target.value)
                        }
                        placeholder="Équipements disponibles, particularités..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addRoom} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une salle
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">
                Paramètres de Réservation
              </h3>
              <p className="text-gray-600">
                Configurez les règles de réservation
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Règles de Réservation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Réservation à l'avance (jours)</Label>
                      <Input
                        type="number"
                        value={setupData.settings.booking.advanceBooking}
                        onChange={(e) =>
                          setSetupData((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              booking: {
                                ...prev.settings.booking,
                                advanceBooking: parseInt(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Durée maximale (heures)</Label>
                      <Input
                        type="number"
                        value={setupData.settings.booking.maxBookingDuration}
                        onChange={(e) =>
                          setSetupData((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              booking: {
                                ...prev.settings.booking,
                                maxBookingDuration: parseInt(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Réservations récurrentes</Label>
                        <p className="text-sm text-gray-600">
                          Autoriser les réservations répétitives
                        </p>
                      </div>
                      <Switch
                        checked={setupData.settings.booking.allowRecurring}
                        onCheckedChange={(checked) =>
                          setSetupData((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              booking: {
                                ...prev.settings.booking,
                                allowRecurring: checked,
                              },
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Approbation requise</Label>
                        <p className="text-sm text-gray-600">
                          Les réservations nécessitent une validation
                        </p>
                      </div>
                      <Switch
                        checked={setupData.settings.booking.requireApproval}
                        onCheckedChange={(checked) =>
                          setSetupData((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              booking: {
                                ...prev.settings.booking,
                                requireApproval: checked,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications email</Label>
                      <p className="text-sm text-gray-600">
                        Recevoir les notifications par email
                      </p>
                    </div>
                    <Switch
                      checked={setupData.settings.notifications.email}
                      onCheckedChange={(checked) =>
                        setSetupData((prev) => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            notifications: {
                              ...prev.settings.notifications,
                              email: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications SMS</Label>
                      <p className="text-sm text-gray-600">
                        Recevoir les notifications par SMS
                      </p>
                    </div>
                    <Switch
                      checked={setupData.settings.notifications.sms}
                      onCheckedChange={(checked) =>
                        setSetupData((prev) => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            notifications: {
                              ...prev.settings.notifications,
                              sms: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications push</Label>
                      <p className="text-sm text-gray-600">
                        Recevoir les notifications push
                      </p>
                    </div>
                    <Switch
                      checked={setupData.settings.notifications.push}
                      onCheckedChange={(checked) =>
                        setSetupData((prev) => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            notifications: {
                              ...prev.settings.notifications,
                              push: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Palette className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Personnalisation</h3>
              <p className="text-gray-600">
                Adaptez l'interface à votre marque
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Couleurs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Couleur principale</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={setupData.branding.primaryColor}
                          onChange={(e) =>
                            setSetupData((prev) => ({
                              ...prev,
                              branding: {
                                ...prev.branding,
                                primaryColor: e.target.value,
                              },
                            }))
                          }
                          className="w-12 h-10"
                        />
                        <Input
                          value={setupData.branding.primaryColor}
                          onChange={(e) =>
                            setSetupData((prev) => ({
                              ...prev,
                              branding: {
                                ...prev.branding,
                                primaryColor: e.target.value,
                              },
                            }))
                          }
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Couleur secondaire</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={setupData.branding.secondaryColor}
                          onChange={(e) =>
                            setSetupData((prev) => ({
                              ...prev,
                              branding: {
                                ...prev.branding,
                                secondaryColor: e.target.value,
                              },
                            }))
                          }
                          className="w-12 h-10"
                        />
                        <Input
                          value={setupData.branding.secondaryColor}
                          onChange={(e) =>
                            setSetupData((prev) => ({
                              ...prev,
                              branding: {
                                ...prev.branding,
                                secondaryColor: e.target.value,
                              },
                            }))
                          }
                          placeholder="#1e40af"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Aperçu des couleurs</h4>
                    <div className="flex gap-2">
                      <div
                        className="w-8 h-8 rounded"
                        style={{
                          backgroundColor: setupData.branding.primaryColor,
                        }}
                      />
                      <div
                        className="w-8 h-8 rounded"
                        style={{
                          backgroundColor: setupData.branding.secondaryColor,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Logo et Favicon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>URL du logo</Label>
                    <Input
                      value={setupData.branding.logo}
                      onChange={(e) =>
                        setSetupData((prev) => ({
                          ...prev,
                          branding: { ...prev.branding, logo: e.target.value },
                        }))
                      }
                      placeholder="https://votre-entreprise.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL du favicon</Label>
                    <Input
                      value={setupData.branding.favicon}
                      onChange={(e) =>
                        setSetupData((prev) => ({
                          ...prev,
                          branding: {
                            ...prev.branding,
                            favicon: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://votre-entreprise.com/favicon.ico"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Inviter votre Équipe</h3>
              <p className="text-gray-600">
                Ajoutez les membres de votre équipe
              </p>
            </div>

            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">
                  Invitations d'équipe
                </h4>
                <p className="text-gray-600 mb-6">
                  Vous pourrez inviter les membres de votre équipe depuis le
                  dashboard. Cette fonctionnalité sera disponible après la
                  configuration initiale.
                </p>
                <Button
                  onClick={() =>
                    (window.location.href = "/dashboard/users/invite")
                  }
                  variant="outline"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Inviter des utilisateurs
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (tenantLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Settings className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Configuration Initiale
            </h1>
            <p className="text-xl text-slate-600">
              Personnalisez votre espace BookingApp
            </p>
            {tenant && (
              <Badge variant="outline" className="mt-2">
                {tenant.name}
              </Badge>
            )}
          </motion.div>

          {/* Indicateur de progression */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index <= currentStep
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      index < currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Contenu principal */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-8">
            <CardContent className="p-8">{renderStepContent()}</CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={saveSetup}
              disabled={isSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Terminer la configuration
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
