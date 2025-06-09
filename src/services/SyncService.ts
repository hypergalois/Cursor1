import NetInfo from "@react-native-community/netinfo";
import { storageService } from "./StorageService";
import { Problem } from "../types/Problem";

class SyncService {
  async isDeviceOnline(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected ?? false;
  }

  async getProblems(): Promise<Problem[]> {
    try {
      // First try to get from local storage
      const localProblems = await storageService.getProblems();
      if (localProblems && localProblems.length > 0) {
        return localProblems;
      }

      // If no local problems, fetch from API
      const response = await fetch("YOUR_API_ENDPOINT/problems");
      const problems = await response.json();

      // Save to local storage for offline use
      await storageService.saveProblems(problems);

      return problems;
    } catch (error) {
      console.error("Error fetching problems:", error);
      return [];
    }
  }

  async syncData(): Promise<void> {
    try {
      const isOnline = await this.isDeviceOnline();
      if (!isOnline) {
        return;
      }

      // Sync local progress with server
      const localProgress = await storageService.getLocalProgress();
      if (localProgress) {
        // Send progress to server
        await fetch("YOUR_API_ENDPOINT/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localProgress),
        });

        // Clear local progress after successful sync
        await storageService.clearLocalProgress();
      }
    } catch (error) {
      console.error("Error syncing data:", error);
    }
  }

  async saveProgressLocally(progress: any): Promise<void> {
    await storageService.saveLocalProgress(progress);
  }
}

export const syncService = new SyncService();
