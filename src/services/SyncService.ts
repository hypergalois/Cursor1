import NetInfo from "@react-native-community/netinfo";
import { storageService } from "./StorageService";
import { Problem } from "../types/Problem";
import { mockProblems } from "../data/mockProblems";

class SyncService {
  private readonly API_ENDPOINT =
    process.env.API_ENDPOINT || "YOUR_API_ENDPOINT";

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

      // If no local problems and API endpoint is configured, fetch from API
      if (this.API_ENDPOINT !== "YOUR_API_ENDPOINT") {
        const response = await fetch(`${this.API_ENDPOINT}/problems`);
        const problems = await response.json();
        await storageService.saveProblems(problems);
        return problems;
      }

      // If API endpoint is not configured, use mock data
      await storageService.saveProblems(mockProblems);
      return mockProblems;
    } catch (error) {
      console.error("Error fetching problems:", error);
      // Fallback to mock data if there's an error
      return mockProblems;
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
