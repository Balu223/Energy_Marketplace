/*export interface UserResponseDto {
  user_Id: number;
  username: string;
  email: string;
  address: string;
  role: string;
  credits: number;
  isActive: boolean;
}
*/
class UserResponse {
  final int userId;
  final String username;
  final String email;
  final String address;
  final String role;
  final double credits;
  final bool isActive;

  UserResponse({
    required this.userId,
    required this.username,
    required this.email,
    required this.address,
    required this.role,
    required this.credits,
    required this.isActive,

  });
  factory UserResponse.fromJson(Map<String, dynamic> json) {
    final creditsRaw = json['credits'];

    return UserResponse(
      userId: json['user_Id'] as int,
      username: json['username'] as String,
      email: json['email'] as String,
      address: json['address'] as String,
      role: json['role'] as String,
      credits:
          creditsRaw == null ? 0 : (creditsRaw as num).toDouble(),
      isActive: json['isActive'] as bool? ?? true,
    );
  }
}
