# views.py

import random
from django.http import JsonResponse
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Issue, Lecturer, Registrar, Department, Course, Student
from .serializers import IssueSerializer, LecturerSerializer, DepartmentSerializer, CourseSerializer, UserUpdateSerializer
from .permissions import IsRegistrar, IsLecturer, IsStudent  

User = get_user_model()

# Helper function to generate OTP
def generate_otp():
    return str(random.randint(100000, 999999))

# Signup View
from django.core.cache import cache  # Import Django cache

@api_view(['POST'])
def signup(request):
    email = request.data.get('email')
    fullname = request.data.get('fullname')
    password = request.data.get('password')
    role = request.data.get('role', 'student')

    if not email or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

    otp = generate_otp()
    cache.set(f'otp_{email}', {'otp': otp, 'fullname': fullname, 'password': password, 'role': role}, timeout=600)  # Store OTP for 10 minutes

    send_mail('Your OTP Code', f'Your OTP is {otp}', 'Group-A-AITS@mail.com', [email])
    return JsonResponse({'message': 'OTP sent to your email!'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return JsonResponse(
            {'error': 'Email and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse(
            {'error': 'Invalid email or password'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(password):
        return JsonResponse(
            {'error': 'Invalid email or password'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    refresh = RefreshToken.for_user(user)
    
    return JsonResponse({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'role': user.role,
        'fullname': user.fullname,
        'email': user.email
    }, status=status.HTTP_200_OK)


# @api_view(['POST'])
# def verify_otp(request):
#     email = request.data.get('email')
#     otp = request.data.get('otp')

#     if not email or not otp:
#         return JsonResponse({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

#     cached_data = cache.get(f'otp_{email}')
#     if not cached_data:
#         return JsonResponse({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

#     if cached_data['otp'] == otp:
#         # Get user data from cache
#         role = cached_data.get('role', 'student')
#         fullname = cached_data.get('fullname', '')
#         password = cached_data.get('password', '')
        
#         # Create appropriate user type based on role
#         if role == 'student':
#             # Create a Student instance
#             from datetime import date
#             user = Student.objects.create(
#                 email=email,
#                 fullname=fullname,
#                 role=role,
#                 student_id=f"ST{random.randint(10000, 99999)}",  # Generate a random student ID
#                 enrollment_date=date.today()  # Set today as enrollment date
#             )
#             user.set_password(password)
#             user.is_verified = True
#             user.save()
            
#         elif role == 'lecturer':
#             # Create a Lecturer instance
#             user = Lecturer.objects.create(
#                 email=email,
#                 fullname=fullname,
#                 role=role,
#                 staff_id=f"LC{random.randint(10000, 99999)}",  # Generate a random lecturer ID
#                 office_location="Not assigned"  # Default value
#             )
#             user.set_password(password)
#             user.is_verified = True
#             user.save()
            
#         elif role == 'registrar':
#             # Create a Registrar instance
#             user = Registrar.objects.create(
#                 email=email,
#                 fullname=fullname,
#                 role=role,
#                 staff_id=f"RG{random.randint(10000, 99999)}",  # Generate a random staff ID
#                 office_number="Not assigned"  # Default value
#             )
#             user.set_password(password)
#             user.is_verified = True
#             user.save()
        
#         else:
#             # Default to CustomUser if role doesn't match
#             user = User.objects.create_user(
#                 fullname=fullname, 
#                 email=email, 
#                 password=password, 
#                 role=role
#             )
#             user.is_verified = True
#             user.save()

#         cache.delete(f'otp_{email}')  # Clear OTP data

#         refresh = RefreshToken.for_user(user)
#         return JsonResponse({'token': str(refresh.access_token), 'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)

#     return JsonResponse({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    if not email or not otp:
        return JsonResponse({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

    cached_data = cache.get(f'otp_{email}')
    if not cached_data:
        return JsonResponse({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

    if cached_data['otp'] == otp:
        role = cached_data.get('role', 'student')
        fullname = cached_data.get('fullname', '')
        password = cached_data.get('password', '')
        
        if role == 'student':
            # Create a Student instance
            from datetime import date
            user = Student.objects.create(
                email=email,
                fullname=fullname,
                role=role,
                student_id=f"ST{random.randint(10000, 99999)}",
                enrollment_date=date.today(),
                # Add any other required Student fields here
            )
            user.set_password(password)
            user.is_verified = True
            user.save()
            
        elif role == 'lecturer':
            # Create a Lecturer instance
            user = Lecturer.objects.create(
                email=email,
                fullname=fullname,
                role=role,
                staff_id=f"LC{random.randint(10000, 99999)}",
                office_location="Not assigned"
                # Add any other required Lecturer fields here
            )
            user.set_password(password)
            user.is_verified = True
            user.save()
            
        elif role == 'registrar':
            # Create a Registrar instance
            user = Registrar.objects.create(
                email=email,
                fullname=fullname,
                role=role,
                staff_id=f"RG{random.randint(10000, 99999)}",
                office_number="Not assigned"
                # Add any other required Registrar fields here
            )
            user.set_password(password)
            user.is_verified = True
            user.save()
        
        else:
            # Default to CustomUser if role doesn't match
            user = User.objects.create_user(
                fullname=fullname, 
                email=email, 
                password=password, 
                role=role
            )
            user.is_verified = True
            user.save()

        cache.delete(f'otp_{email}')

        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'token': str(refresh.access_token), 
            'message': 'User created successfully!',
            'role': role,
            'fullname': fullname,
            'email': email
        }, status=status.HTTP_201_CREATED)

    return JsonResponse({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
# Resend OTP View
@api_view(['POST'])
def resend_otp(request):
    email = request.data.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.filter(email=email).first()
    if not user:
        return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    user.otp = generate_otp()
    user.otp_created_at = timezone.now()  # Reset the OTP timestamp
    user.save()
    send_mail('Your OTP Code', f'Your OTP is {user.otp}', 'AITS@mail.com', [email])
    return JsonResponse({'message': 'OTP resent successfully!'}, status=status.HTTP_200_OK)

# Department View (Only accessible by registrars)

class DepartmentView(generics.ListCreateAPIView):
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsRegistrar]

    def get_queryset(self):
        return Department.objects.all()

    def perform_create(self, serializer):
        serializer.save()

# views.py
class CourseView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.all().select_related('department')

    def perform_create(self, serializer):
        department = serializer.validated_data.get('department')
        if not Department.objects.filter(id=department.id).exists():
            raise serializer.ValidationError("Department does not exist")
        serializer.save()

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

# Issue View (Only accessible by students for their own issues)
from rest_framework.parsers import MultiPartParser, FormParser  

# class IssueView(generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = IssueSerializer
#     permission_classes = [IsAuthenticated]
#     parser_classes = [MultiPartParser, FormParser]  # Add parsers to handle file uploads

#     def get_queryset(self):
#         if self.request.user.role == 'student':
#             return Issue.objects.filter(student=self.request.user, course__students=self.request.user)
#         return Issue.objects.all()

#     def perform_create(self, serializer):
#         if self.request.user.role == 'student':
#             course = serializer.validated_data.get('course')
#             if course and self.request.user not in course.students.all():
#                 raise PermissionDenied('You can only report issues for courses you are enrolled in.')
#             serializer.save(student=self.request.user)
#         else:
#             raise PermissionDenied('Only students can create issues.')

#     def perform_update(self, serializer):
#         if self.request.user.role == 'student':
#             serializer.save()
#         else:
#             raise PermissionDenied('Only students can update issues.')
        
# Assign Issue View (Only accessible by registrars)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsRegistrar])  # Only registrars can assign issues
def assign_issue(request, issue_id, lecturer_id):
    issue = get_object_or_404(Issue, id=issue_id)
    lecturer = get_object_or_404(Lecturer, id=lecturer_id)
    
    if issue.course and lecturer.department != issue.course.department:
        return JsonResponse({'error': 'Lecturer must belong to the same department as the course'}, status=status.HTTP_400_BAD_REQUEST)
    
    issue.assign_to_lecturer(request.user, lecturer)
    issue.assigned_at = timezone.now()
    issue.save()
    return JsonResponse({'message': 'Issue assigned successfully'})

# Resolve Issue View (Accessible by lecturers and registrars)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resolve_issue(request, issue_id):
    issue = get_object_or_404(Issue, id=issue_id)
    
    if request.user.role in ['registrar', 'lecturer'] and (issue.assigned_to == request.user or request.user.role == 'registrar'):
        issue.resolved_by = request.user
        issue.resolved_at = timezone.now()
        issue.status = 'resolved'
        issue.save()
        return JsonResponse({'message': 'Issue resolved successfully'})
    
    return JsonResponse({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

# User Info View (Accessible by authenticated users)
class UserInfoView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        user_data = {
            "id": user.id,
            "email": user.email,
            "fullname": user.fullname,
            "role": user.role,
            "phone_number": user.phone_number,
            "profile_picture": user.profile_picture.url if user.profile_picture else None
        }
        return JsonResponse(user_data, status=status.HTTP_200_OK)

# User Edit View (Accessible by authenticated users)
class UserEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserUpdateSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return response
    

  # Add these imports at the top

from django.db import transaction

# Add these new views at the bottom of views.py

class LecturerView(generics.ListCreateAPIView):
    serializer_class = LecturerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Lecturer.objects.all()

    @transaction.atomic
    def perform_create(self, serializer):
        # Create the base user first
        user_data = {
            'email': serializer.validated_data['email'],
            'fullname': serializer.validated_data['fullname'],
            'password': serializer.validated_data['password'],
            'role': 'lecturer'
        }
        user = User.objects.create_user(**user_data)
        
        # Create the lecturer profile
        lecturer = Lecturer.objects.create(
            id=user.id,
            email=user.email,
            fullname=user.fullname,
            role=user.role,
            staff_id=serializer.validated_data['staff_id'],
            department=serializer.validated_data['department'],
            office_location=serializer.validated_data['office_location']
        )
        
        # Set courses if provided
        if 'courses' in serializer.validated_data:
            lecturer.courses.set(serializer.validated_data['courses'])
        
        return lecturer
    
class LecturerView(generics.ListAPIView):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer
    permission_classes = [IsAuthenticated]     

class LecturerIssuesView(generics.ListAPIView):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated, IsLecturer]

    def get_queryset(self):
        # Only show issues assigned to the current lecturer
        return Issue.objects.filter(assigned_to=self.request.user)

from rest_framework_simplejwt.views import TokenRefreshView

# class CustomTokenRefreshView(TokenRefreshView):
#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)
#         if response.status_code == 200:
#             # You can add additional processing here if needed
#             pass
#         return response

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response
from rest_framework import status

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Ensure the refresh token is properly formatted
        if 'refresh' not in request.data:
            return Response(
                {'error': 'Refresh token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Add any additional processing here if needed
            pass
            
        return response
    

# In views.py, update the IssueView and add new endpoints

class IssueView(generics.ListCreateAPIView):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        if self.request.user.role == 'student':
            return Issue.objects.filter(student=self.request.user)
        elif self.request.user.role == 'lecturer':
            return Issue.objects.filter(assigned_to=self.request.user)
        return Issue.objects.all()

    def perform_create(self, serializer):
        if self.request.user.role == 'student':
            # Get the Student instance from the CustomUser
            try:
                student = Student.objects.get(id=self.request.user.id)
            except Student.DoesNotExist:
                raise PermissionDenied('Student profile not found')

            # Validate that the student is enrolled in the course
            course = serializer.validated_data.get('course')
            if course and course not in student.enrolled_courses.all():
                raise PermissionDenied('You can only report issues for courses you are enrolled in.')

            # Save the issue with the student instance
            serializer.save(
                student=student,
                status='open'
            )
        else:
            raise PermissionDenied('Only students can create issues.')
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_course_lecturers(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        lecturers = course.lecturer_set.all()  # Get all lecturers for this course
        serializer = LecturerSerializer(lecturers, many=True)
        return Response(serializer.data)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_courses(request):
    if request.user.role != 'student':
        return Response({'error': 'Only students can access this endpoint'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    student = request.user
    courses = student.enrolled_courses.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)    