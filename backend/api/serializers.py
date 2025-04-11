from rest_framework import serializers
from .models import Department, Course, Lecturer, Student, Registrar, Issue
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'fullname', 'role', 'is_verified', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'termsAccepted']

# class LecturerSerializer(UserSerializer):
#     department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
#     courses = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), many=True, required=False)
#     password = serializers.CharField(write_only=True)
#     staff_id = serializers.CharField(max_length=20)
#     office_location = serializers.CharField(max_length=100)

#     class Meta:
#         model = Lecturer
#         fields = UserSerializer.Meta.fields + [
#             'staff_id', 'department', 'courses', 'office_location', 'password'
#         ]
#         extra_kwargs = {
#             'password': {'write_only': True},
#             'role': {'read_only': True}
#         }

#     def create(self, validated_data):
#         # This will be handled in the view's perform_create
#         pass
# In serializers.py - Fix the LecturerSerializer

class LecturerSerializer(UserSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    courses = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), many=True, required=False)
    password = serializers.CharField(write_only=True)
    staff_id = serializers.CharField(max_length=20)
    office_location = serializers.CharField(max_length=100)

    class Meta:
        model = Lecturer
        fields = UserSerializer.Meta.fields + [
            'staff_id', 'department', 'courses', 'office_location', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'read_only': True}
        }

    def create(self, validated_data):
        courses = validated_data.pop('courses', [])
        password = validated_data.pop('password', None)
        
        lecturer = Lecturer.objects.create(**validated_data)
        
        if password:
            lecturer.set_password(password)
            lecturer.save()
            
        if courses:
            lecturer.courses.set(courses)
            
        return lecturer
    
class StudentSerializer(UserSerializer):
    department = serializers.StringRelatedField()
    enrolled_courses = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), many=True)

    class Meta:
        model = Student
        fields = UserSerializer.Meta.fields + ['student_id', 'department', 'enrolled_courses', 'enrollment_date']

class RegistrarSerializer(UserSerializer):
    staff_id = serializers.CharField(max_length=20)
    office_number = serializers.CharField(max_length=20)

    class Meta:
        model = Registrar
        fields = UserSerializer.Meta.fields + ['staff_id', 'office_number']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'code']

# serializers.py
# class CourseSerializer(serializers.ModelSerializer):
#     department = DepartmentSerializer(read_only=True)
#     department_id = serializers.PrimaryKeyRelatedField(
#         queryset=Department.objects.all(),
#         source='department',
#         write_only=True
#     )

#     class Meta:
#         model = Course
#         fields = ['id', 'name', 'code', 'department', 'department_id']
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'department', 'description']
        extra_kwargs = {
            'department': {'required': True}
        }

class IssueSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    assigned_to = LecturerSerializer(read_only=True)
    assigned_by = RegistrarSerializer(read_only=True)
    resolved_by = RegistrarSerializer(read_only=True)
    
    issue_type = serializers.ChoiceField(choices=Issue.ISSUE_CHOICES)
    semester = serializers.ChoiceField(choices=Issue.SEMESTER_CHOICES)
    status = serializers.ChoiceField(choices=Issue.ISSUE_STATUS)
    image = serializers.ImageField(required=False, allow_null=True) 
    status = serializers.ChoiceField(choices=Issue.ISSUE_STATUS, required=False)

    class Meta:
        model = Issue
        fields = [
            'id', 'student', 'issue_type', 'semester', 'course', 'title', 'description', 
            'image','status', 'created_at', 'updated_at', 'assigned_to', 'assigned_by', 
            'assigned_at', 'resolved_by', 'resolved_at'
        ]

    def create(self, validated_data):
    # Remove student from validated_data if it exists (it will be set from the request)
        validated_data.pop('student', None)
        
        # Get student from context (set by the view)
        student = self.context['request'].user
        try:
            student_instance = Student.objects.get(id=student.id)
        except Student.DoesNotExist:
            raise serializers.ValidationError("Student profile not found")
        
        validated_data['student'] = student_instance
        return super().create(validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr not in ['assigned_to', 'assigned_by', 'resolved_by']:
                setattr(instance, attr, value)
        instance.save()
        return instance


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['fullname', 'phone_number', 'profile_picture'] 
    
    def update(self, instance, validated_data):
        instance.fullname = validated_data.get('fullname', instance.fullname)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance