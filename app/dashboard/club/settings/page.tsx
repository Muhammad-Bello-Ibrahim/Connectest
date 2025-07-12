"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Users, Eye, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ClubSettingsPage() {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  
  const [settings, setSettings] = useState({
    notifications: {
      newMembers: true,
      postEngagement: true,
      adminMessages: true,
      systemUpdates: false,
      weeklyReports: true
    },
    privacy: {
      profileVisibility: "public",
      memberListVisibility: "members",
      postVisibility: "public",
      allowDirectMessages: true,
      autoApproveMembers: false
    },
    membership: {
      requireApproval: true,
      allowInvitations: true,
      maxMembers: 500,
      minimumLevel: "none"
    },
    posting: {
      allowMemberPosts: false,
      requireApproval: true,
      allowComments: true,
      allowLikes: true,
      allowSharing: true
    }
  })

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // API call to save settings would go here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast({
        title: "Settings Saved",
        description: "Your club settings have been successfully updated."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again."
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const updatePrivacySetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }))
  }

  const updateMembershipSetting = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      membership: {
        ...prev.membership,
        [key]: value
      }
    }))
  }

  const updatePostingSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      posting: {
        ...prev.posting,
        [key]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Club Settings</h1>
          <p className="text-muted-foreground">
            Configure your club's preferences and permissions
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Members</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new members join your club
                </p>
              </div>
              <Switch
                checked={settings.notifications.newMembers}
                onCheckedChange={(checked) => updateNotificationSetting("newMembers", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Post Engagement</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications for likes, comments, and shares on your posts
                </p>
              </div>
              <Switch
                checked={settings.notifications.postEngagement}
                onCheckedChange={(checked) => updateNotificationSetting("postEngagement", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Admin Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Important messages from system administrators
                </p>
              </div>
              <Switch
                checked={settings.notifications.adminMessages}
                onCheckedChange={(checked) => updateNotificationSetting("adminMessages", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Updates about new features and system changes
                </p>
              </div>
              <Switch
                checked={settings.notifications.systemUpdates}
                onCheckedChange={(checked) => updateNotificationSetting("systemUpdates", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Weekly summary of club activity and engagement
                </p>
              </div>
              <Switch
                checked={settings.notifications.weeklyReports}
                onCheckedChange={(checked) => updateNotificationSetting("weeklyReports", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy & Visibility
            </CardTitle>
            <CardDescription>
              Control who can see your club and its content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) => updatePrivacySetting("profileVisibility", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Everyone can see</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="faculty">Faculty Only</SelectItem>
                    <SelectItem value="private">Private - Members Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Member List Visibility</Label>
                <Select
                  value={settings.privacy.memberListVisibility}
                  onValueChange={(value) => updatePrivacySetting("memberListVisibility", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="members">Members Only</SelectItem>
                    <SelectItem value="admins">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Post Visibility</Label>
              <Select
                value={settings.privacy.postVisibility}
                onValueChange={(value) => updatePrivacySetting("postVisibility", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Visible in general feed</SelectItem>
                  <SelectItem value="students">Students Only</SelectItem>
                  <SelectItem value="members">Members Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Direct Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Let students send direct messages to your club
                </p>
              </div>
              <Switch
                checked={settings.privacy.allowDirectMessages}
                onCheckedChange={(checked) => updatePrivacySetting("allowDirectMessages", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Membership Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Membership Management
            </CardTitle>
            <CardDescription>
              Configure how students can join your club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Approval</Label>
                <p className="text-sm text-muted-foreground">
                  Manually approve each membership request
                </p>
              </div>
              <Switch
                checked={settings.membership.requireApproval}
                onCheckedChange={(checked) => updateMembershipSetting("requireApproval", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Approve Members</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve students who meet matching criteria
                </p>
              </div>
              <Switch
                checked={settings.membership.autoApproveMembers}
                onCheckedChange={(checked) => updateMembershipSetting("autoApproveMembers", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Invitations</Label>
                <p className="text-sm text-muted-foreground">
                  Let current members invite their friends
                </p>
              </div>
              <Switch
                checked={settings.membership.allowInvitations}
                onCheckedChange={(checked) => updateMembershipSetting("allowInvitations", checked)}
              />
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Maximum Members</Label>
                <Input
                  type="number"
                  value={settings.membership.maxMembers}
                  onChange={(e) => updateMembershipSetting("maxMembers", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Level</Label>
                <Select
                  value={settings.membership.minimumLevel}
                  onValueChange={(value) => updateMembershipSetting("minimumLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Restriction</SelectItem>
                    <SelectItem value="100l">100 Level and above</SelectItem>
                    <SelectItem value="200l">200 Level and above</SelectItem>
                    <SelectItem value="300l">300 Level and above</SelectItem>
                    <SelectItem value="400l">400 Level and above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posting Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Post & Content Settings
            </CardTitle>
            <CardDescription>
              Manage how content is shared in your club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Member Posts</Label>
                <p className="text-sm text-muted-foreground">
                  Let members create posts in the club
                </p>
              </div>
              <Switch
                checked={settings.posting.allowMemberPosts}
                onCheckedChange={(checked) => updatePostingSetting("allowMemberPosts", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Post Approval</Label>
                <p className="text-sm text-muted-foreground">
                  Review member posts before they're published
                </p>
              </div>
              <Switch
                checked={settings.posting.requireApproval}
                onCheckedChange={(checked) => updatePostingSetting("requireApproval", checked)}
                disabled={!settings.posting.allowMemberPosts}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Let members comment on posts
                </p>
              </div>
              <Switch
                checked={settings.posting.allowComments}
                onCheckedChange={(checked) => updatePostingSetting("allowComments", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Likes</Label>
                <p className="text-sm text-muted-foreground">
                  Enable like reactions on posts
                </p>
              </div>
              <Switch
                checked={settings.posting.allowLikes}
                onCheckedChange={(checked) => updatePostingSetting("allowLikes", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Let members share posts to their feeds
                </p>
              </div>
              <Switch
                checked={settings.posting.allowSharing}
                onCheckedChange={(checked) => updatePostingSetting("allowSharing", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}