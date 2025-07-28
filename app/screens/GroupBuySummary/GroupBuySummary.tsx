import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import GroupBuyServices from "../../services/GroupBuyServices";
import UserServices from "../../services/UserServices";
import { GroupBuySummaryNavigationProp, GroupBuySummaryRouteProp } from "../../types/Navigations";
import { Contribution, GroupBuyDetails } from "../../types/GroupBuyTypes";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { DealCard } from "../Deals/components/DealCard";
import { Deal } from "../../types/Deal";
import DealsServices from "../../services/DealsServices";

type ContributionWithUser = Contribution & {
    displayName: string;
    photoURL: string;
};

type Props = {
    navigation: GroupBuySummaryNavigationProp;
    route: GroupBuySummaryRouteProp;
};

const GroupBuySummary = ({ navigation, route }: Props) => {
    const { user } = useAuth();
    const [groupBuy, setGroupBuy] = useState<GroupBuyDetails | null>(null);
    const [deal, setDeal] = useState<Deal | null>(null);
    const [contributions, setContributions] = useState<ContributionWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingContribution, setEditingContribution] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState(false);

    const isOwner = user?.uid === groupBuy?.ownerUID;

    useFocusEffect(
        useCallback(() => {
            const loadGroupBuyDetails = async () => {
                setIsLoading(true);
                try {
                    const groupBuyData = await GroupBuyServices.fetchGroupBuy(route.params.groupBuyID);
                    if (groupBuyData) {
                        setGroupBuy(groupBuyData);

                        // Fetch user details for each contribution
                        const contributionsWithUsers = await Promise.all(
                            groupBuyData.contributions.map(async (contribution) => {
                                const displayName = await UserServices.getUserDisplayName(contribution.userUID);
                                const photoURL = await UserServices.getUserPhotoURL(contribution.userUID);
                                return {
                                    ...contribution,
                                    displayName,
                                    photoURL
                                };
                            })
                        );

                        setContributions(contributionsWithUsers);

                        const dealData = await DealsServices.fetchDeal(groupBuyData?.dealID);
                        if (dealData) {
                            setDeal(dealData);
                        }
                    }
                } catch (err) {
                    console.error("Failed to load GroupBuy details.", err);
                } finally {
                    setIsLoading(false);
                }
            };

            loadGroupBuyDetails();
        }, [route.params.groupBuyID])
    );

    const onChanged = (text: string) => {
        text = text.replace(/\D/g, ""); // Deletes non-digit characters.
        setEditAmount(text);
    }

    const handleEditContribution = (userUID: string, currentAmount: number) => {
        if (user?.uid !== userUID) {
            Alert.alert("Error", "You can only edit your own contribution.");
            return;
        }

        setEditingContribution(userUID);
        setEditAmount(currentAmount.toString());
    };

    const handleSaveContribution = async () => {
        if (!editingContribution || !groupBuy) return;

        const newAmount = parseFloat(editAmount);
        if (isNaN(newAmount) || newAmount < 0) {
            Alert.alert("Error", "Please enter a valid amount.");
            return;
        }

        setIsUpdating(true);
        try {
            await GroupBuyServices.updateUserContribution(groupBuy.id, editingContribution, newAmount);

            // Update local state
            setContributions(prev =>
                prev.map(c =>
                    c.userUID === editingContribution
                        ? { ...c, amount: newAmount }
                        : c
                )
            );

            setEditingContribution(null);
            setEditAmount("");
            Alert.alert("Success", "Contribution updated successfully.");
        } catch (error: any) {
            console.error("Failed to update contribution:", error);
            Alert.alert("Error", "Failed to update contribution. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingContribution(null);
        setEditAmount("");
    };

    const handleToggleAcceptingMembers = async () => {
        if (!groupBuy || groupBuy.status === "finished" || !user?.uid) return;

        try {
            await GroupBuyServices.toggleAcceptingNewMembers(groupBuy.id, user.uid);
            const newStatus = groupBuy.status === "closed" ? "active" : "closed";
            setGroupBuy(prev => prev ? { ...prev, status: newStatus } : null);
            Alert.alert("Success", `GroupBuy is now ${newStatus === "closed" ? "closed" : "open"} to new members.`);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    const handleFinishGroupBuy = async () => {
        if (!groupBuy || !user?.uid) return;

        Alert.alert(
            "Finish GroupBuy",
            "Are you sure you want to finish this GroupBuy? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Finish",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await GroupBuyServices.finishGroupBuy(groupBuy.id, user.uid);
                            setGroupBuy(prev => prev ? { ...prev, status: "finished" } : null);
                            Alert.alert("Success", "GroupBuy has been finished.");
                        } catch (error: any) {
                            Alert.alert("Error", error.message);
                        }
                    }
                }
            ]
        );
    };

    const handleKickMember = async (memberUID: string, memberName: string) => {
        if (!groupBuy || !user?.uid) return;

        Alert.alert(
            "Kick Member",
            `Are you sure you want to kick ${memberName} from this GroupBuy?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Kick",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await GroupBuyServices.kickMember(groupBuy.id, user.uid, memberUID);

                            // Update local state
                            setContributions(prev => prev.filter(c => c.userUID !== memberUID));
                            setGroupBuy(prev => prev ? {
                                ...prev,
                                participants: prev.participants.filter(uid => uid !== memberUID)
                            } : null);

                            Alert.alert("Success", `${memberName} has been kicked from the GroupBuy.`);
                        } catch (error: any) {
                            Alert.alert("Error", error.message);
                        }
                    }
                }
            ]
        );
    };

    const handleExitGroupBuy = async () => {
        if (!groupBuy || !user?.uid) return;

        Alert.alert(
            "Exit GroupBuy",
            "Are you sure you want to exit this GroupBuy?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Exit",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await GroupBuyServices.exitGroupBuy(user.uid, groupBuy.id);
                            Alert.alert("Success", "You have exited the GroupBuy.", [
                                {
                                    text: "OK",
                                    onPress: () => {
                                        navigation.goBack();
                                        navigation.goBack();
                                    }
                                }
                            ]);
                        } catch (error: any) {
                            Alert.alert("Error", error.message);
                        }
                    }
                }
            ]
        );
    };

    const getTotalContributions = () => {
        return contributions.reduce((total, contribution) => total + contribution.amount, 0);
    };

    const getStatusColor = () => {
        switch (groupBuy?.status) {
            case "active": return Colors.primary;
            case "finished": return "#666";
            case "closed": return "#f59e0b";
            default: return Colors.primary;
        }
    };

    const getStatusText = () => {
        if (!groupBuy) return "";
        if (groupBuy.status === "finished") return "Finished";
        if (groupBuy.status === "closed") return "Not Accepting";
        return "Active";
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!groupBuy) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Failed to load GroupBuy details.</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-6">
                {/* Summary Header */}
                <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-2xl font-bold">GroupBuy Summary</Text>
                        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: getStatusColor() + "20" }}>
                            <Text className="font-semibold" style={{ color: getStatusColor() }}>
                                {getStatusText()}
                            </Text>
                        </View>
                    </View>

                    <View className="mb-3">
                        {deal &&
                            <DealCard deal={deal} />
                        }
                    </View>

                    <View className="border-t border-gray-200 pt-4 flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="text-gray-600">Total Participants</Text>
                            <Text className="text-xl font-semibold">{contributions.length}</Text>
                        </View>
                        <View>
                            <Text className="text-gray-600">Total Amount</Text>
                            <Text className="text-xl font-semibold" style={{ color: Colors.primary }}>
                                {getTotalContributions()}
                            </Text>
                        </View>
                    </View>

                    {isOwner && (
                        <View className="border-t border-gray-200 pt-4">
                            <Text className="text-lg font-semibold mb-3">Owner Controls</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {groupBuy.status !== "finished" && <TouchableOpacity
                                    onPress={handleToggleAcceptingMembers}
                                    className="px-4 py-2 rounded-lg"
                                    style={{ backgroundColor: groupBuy.status === "active" ? "#ef4444" : Colors.primary }}
                                >
                                    <Text className="text-white font-medium">
                                        {groupBuy.status === "active" ? "Close to New Members" : "Open to New Members"}
                                    </Text>
                                </TouchableOpacity>}

                                {groupBuy.status !== "finished" && (
                                    <TouchableOpacity
                                        onPress={handleFinishGroupBuy}
                                        className="px-4 py-2 rounded-lg bg-orange-500"
                                    >
                                        <Text className="text-white font-medium">Finish GroupBuy</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                </View>

                {/* Contributions List */}
                <View className="bg-white rounded-2xl p-6 shadow-sm">
                    <Text className="text-xl font-bold mb-4">Individual Contributions</Text>

                    {contributions.map((contribution, index) => (
                        <View key={contribution.userUID} className="mb-4">
                            <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <View className="flex-row items-center flex-1">
                                    <View className="w-10 h-10 rounded-full bg-gray-300 mr-3 justify-center items-center">
                                        <Text className="text-white font-semibold">
                                            {contribution.displayName.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <View className="flex-row items-center">
                                            <Text className="font-semibold text-gray-800">
                                                {contribution.displayName}
                                            </Text>
                                            {contribution.userUID === groupBuy.ownerUID && (
                                                <View className="ml-2 px-2 py-1 rounded bg-yellow-100">
                                                    <Text className="text-yellow-800 text-xs font-medium">Owner</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text className="text-gray-500 text-sm">
                                            {contribution.userUID === user?.uid ? "You" : "Participant"}
                                        </Text>
                                    </View>
                                </View>

                                {editingContribution === contribution.userUID ? (
                                    <View className="flex-row items-center">
                                        <TextInput
                                            value={editAmount}
                                            onChangeText={onChanged}
                                            keyboardType="numeric"
                                            className="border border-gray-300 rounded-lg px-3 py-2 w-20 text-center"
                                            autoFocus
                                        />
                                        <TouchableOpacity
                                            onPress={handleSaveContribution}
                                            disabled={isUpdating}
                                            className="ml-2 p-2"
                                        >
                                            <Ionicons
                                                name="checkmark"
                                                size={20}
                                                color={Colors.primary}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={handleCancelEdit}
                                            className="ml-1 p-2"
                                        >
                                            <Ionicons
                                                name="close"
                                                size={20}
                                                color="#666"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View className="flex-row items-center">
                                        <Text className="text-lg font-semibold mr-2">
                                            {contribution.amount}
                                        </Text>
                                        {contribution.userUID === user?.uid && (
                                            <TouchableOpacity
                                                onPress={() => handleEditContribution(contribution.userUID, contribution.amount)}
                                                className="p-2"
                                            >
                                                <Ionicons
                                                    name="pencil"
                                                    size={16}
                                                    color={Colors.primary}
                                                />
                                            </TouchableOpacity>
                                        )}
                                        {isOwner && contribution.userUID !== user?.uid && (
                                            <TouchableOpacity
                                                onPress={() => handleKickMember(contribution.userUID, contribution.displayName)}
                                                className="p-2 ml-1"
                                            >
                                                <Ionicons
                                                    name="person-remove"
                                                    size={16}
                                                    color="#ef4444"
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {(!isOwner || isOwner && groupBuy.status === "finished") && (
                    <View className="mt-6">
                        <TouchableOpacity
                            onPress={handleExitGroupBuy}
                            className="bg-red-500 p-4 rounded-2xl items-center"
                        >
                            <Text className="text-white font-semibold text-lg">Exit GroupBuy</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({});

export default GroupBuySummary;

